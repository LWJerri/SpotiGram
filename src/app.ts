import { UpdateState, filters } from "@mtcute/dispatcher";
import "dotenv/config";
import { isHaveUrlEntities, isSpotifyUrl, isViaOdesliBot } from "./filters";
import { ODESLI_BOT_ID, SPOTIFY_TRACK_ID_REGEXP } from "./helpers/constants";
import { env } from "./helpers/env";
import inlineCall from "./helpers/inlineCall";
import saveSession from "./helpers/saveSession";
import { SpotifyManager } from "./manager";
import { client, dispatcher } from "./mtcute";

const spotifyManager = new SpotifyManager();

dispatcher.onNewMessage(filters.and(filters.chat("private"), filters.not(filters.me), isViaOdesliBot), async (msg) => {
  const spotifyUrlEntity = msg.entities.find(({ params }) => params.kind === "text_link" && isSpotifyUrl(params.url));

  if (!spotifyUrlEntity || !spotifyUrlEntity.is("text_link")) return;

  const [trackId] = spotifyUrlEntity.params.url.match(SPOTIFY_TRACK_ID_REGEXP)!;

  await spotifyManager.process([trackId], msg.chat.id);
});

dispatcher.onNewMessage(
  filters.and(filters.chat("private"), filters.not(filters.me), isHaveUrlEntities),
  async (msg, state: UpdateState<{}>) => {
    let trackListIds = [];

    for (let i = 0; i < msg.urlEntities.length; i++) {
      await state.throttle("inlineCallsCycle", 5, 10);

      const inlineCallResult = await inlineCall(msg.urlEntities[i].text, ODESLI_BOT_ID);
      const inlineResult = inlineCallResult?.results.pop();

      if (inlineResult?.sendMessage._ !== "botInlineMessageText" || !inlineResult.sendMessage.entities?.length) {
        continue;
      }

      const spotifyEntity = inlineResult.sendMessage.entities.find(
        (entity) => entity._ === "messageEntityTextUrl" && isSpotifyUrl(entity.url),
      );

      if (spotifyEntity?._ !== "messageEntityTextUrl") continue;

      const [trackId] = spotifyEntity.url.match(SPOTIFY_TRACK_ID_REGEXP)!;

      trackListIds.push(trackId);
    }

    if (!trackListIds.length) return;

    await spotifyManager.process([...new Set(trackListIds)], msg.chat.id);
  },
);

client.run({ session: env.TG_SESSION }, async () => {
  if (env.SAVE_SESSION) return await saveSession();

  await spotifyManager.synchronize();

  console.log("🚀 SpotiGram ready to use");
});

dispatcher.onError(async (error, update, state) => {
  console.error("⚠️ Dispatcher error:", error, update.data);

  return true;
});

process.on("uncaughtException", (err) => console.error(err));
process.on("unhandledRejection", (err) => console.error(err));
