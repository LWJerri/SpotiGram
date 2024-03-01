import { tl } from "@mtcute/core";
import { UpdateState, filters } from "@mtcute/dispatcher";
import { PrismaClient } from "@prisma/client";
import { SpotifyError } from "@soundify/web-api";
import { schedule } from "node-cron";
import { environment } from "./config/index.js";
import { isHasSpotifyUrl, isHasUrlEntities, isViaOdesliBot } from "./filters/index.js";
import { ODESLI_BOT_ID, SPOTIFY_TRACK_ID_REGEXP } from "./helpers/index.js";
import { SpotifyManager } from "./spotify/index.js";
import { client, dispatcher, inlineAct, session } from "./telegram/index.js";

export const prisma = new PrismaClient();

dispatcher.onNewMessage(filters.and(filters.chat("private"), filters.not(filters.me), isViaOdesliBot), async (msg) => {
  const spotifyUrlEntity = msg.entities.find(
    ({ params }) => params.kind === "text_link" && isHasSpotifyUrl(params.url),
  );

  if (!spotifyUrlEntity || !spotifyUrlEntity.is("text_link")) return;

  const [trackId] = spotifyUrlEntity.params.url.match(SPOTIFY_TRACK_ID_REGEXP)!;

  await new SpotifyManager().process([trackId], msg.chat.id);
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
        inlineCallResult = await inlineAct(entity.text, ODESLI_BOT_ID);
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

    await new SpotifyManager().process([...trackListIds], msg.chat.id);
  },
);

schedule("0 * * * *", async () => await new SpotifyManager().synchronize());

schedule("*/5 * * * *", async () => {
  const queueTrackList = await prisma.trackQueue.findMany();

  for (const track of queueTrackList) {
    try {
      await new SpotifyManager().addQueuedTrack(track.trackUri);

      await prisma.trackQueue.delete({ where: { id: track.id } });
    } catch (err) {
      if (err instanceof SpotifyError && err.status === 404) continue;

      console.error(err);

      continue;
    }
  }
});

if (environment.SAVE_SESSION) {
  try {
    await session();
  } catch (err) {
    console.error("Can't save session string.", err);
  }
}

client.run({ session: environment.TG_SESSION }, async () => {
  await new SpotifyManager().synchronize();

  console.log("🚀 SpotiGram ready to use");
});

dispatcher.onError(async (error, update) => {
  console.error("⚠️ Dispatcher error:", error, update.data);

  return true;
});

process.on("uncaughtException", (err) => console.error(err));
process.on("unhandledRejection", (err) => console.error(err));
