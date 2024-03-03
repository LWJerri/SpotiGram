import { tl } from "@mtcute/core";
import { UpdateState, filters } from "@mtcute/dispatcher";
import { SpotifyError } from "@soundify/web-api";
import "dotenv/config";
import { schedule } from "node-cron";
import { environment } from "./config/environment.js";
import { prisma } from "./db/prisma.js";
import { isHasSpotifyUrl, isHasUrlEntities, isViaOdesliBot } from "./filters/index.js";
import { ODESLI_BOT_USERNAME, SPOTIFY_TRACK_ID_REGEXP } from "./helpers/constants.js";
import { SpotifyManager } from "./spotify/manager.js";
import { client, dispatcher, inlineAct, session } from "./telegram/index.js";

const spotifyManager = new SpotifyManager();

dispatcher.onNewMessage(filters.and(filters.chat("private"), filters.not(filters.me), isViaOdesliBot), async (msg) => {
  const spotifyUrlEntity = msg.entities.find(
    ({ params }) => params.kind === "text_link" && isHasSpotifyUrl(params.url),
  );

  if (!spotifyUrlEntity || !spotifyUrlEntity.is("text_link")) return;

  const [trackId] = spotifyUrlEntity.params.url.match(SPOTIFY_TRACK_ID_REGEXP)!;

  await spotifyManager.process([trackId], msg.chat.id);
});

dispatcher.onNewMessage(
  filters.and(filters.chat("private"), filters.not(filters.me), isHasUrlEntities),
  async (msg, state: UpdateState<{}>) => {
    const urlEntitiesList = msg.entities.filter((entity) => entity.kind === "url");

    const trackListIds = new Set<string>();

    for (const entity of urlEntitiesList) {
      await state.throttle("inlineCallsCycle", 5, 10);

      let inlineCallResult: tl.messages.RawBotResults;

      try {
        inlineCallResult = await inlineAct(entity.text, ODESLI_BOT_USERNAME);
      } catch (err) {
        console.error(err);

        continue;
      }

      const inlineResult = inlineCallResult?.results.pop();

      if (inlineResult?.sendMessage._ !== "botInlineMessageText" || !inlineResult.sendMessage.entities?.length) {
        continue;
      }

      const spotifyEntity = inlineResult.sendMessage.entities.find((entity) => {
        return entity._ === "messageEntityTextUrl" && isHasSpotifyUrl(entity.url);
      });

      if (spotifyEntity?._ !== "messageEntityTextUrl") continue;

      const matchResult = spotifyEntity.url.match(SPOTIFY_TRACK_ID_REGEXP)!;

      if (!matchResult) continue;

      trackListIds.add(matchResult[0]);
    }

    if (!trackListIds.size) return;

    await spotifyManager.process([...trackListIds], msg.chat.id);
  },
);

schedule("0 * * * *", async () => await spotifyManager.synchronize());

schedule("*/5 * * * *", async () => {
  const queueTrackList = await prisma.trackQueue.findMany();

  for (const track of queueTrackList) {
    try {
      await spotifyManager.addQueuedTrack(track.trackUri);

      await prisma.trackQueue.delete({ where: { id: track.id } });
    } catch (err) {
      if (err instanceof SpotifyError && err.status === 404) continue;

      console.error(err);

      continue;
    }
  }
});

client.run({ session: environment.TG_SESSION }, async () => {
  if (environment.SAVE_SESSION) {
    await session();
  }

  await spotifyManager.synchronize();

  console.log("🚀 SpotiGram ready to use");
});

dispatcher.onError(async (error, update) => {
  console.error("⚠️ Dispatcher error:", error, update.data);

  return true;
});

process.on("uncaughtException", (err) => console.error(err));
process.on("unhandledRejection", (err) => console.error(err));
