import { UpdateState, filters } from "@mtcute/dispatcher";
import "dotenv/config";
import { schedule } from "node-cron";
import { odesli, urlLinks } from "./dispatchers";
import { isHaveUrlEntities, isViaOdesliBot } from "./filters";
import { env } from "./helpers/env";
import saveSession from "./helpers/saveSession";
import { SpotifyManager } from "./manager";
import { client, dispatcher } from "./mtcute";
import { processQueue } from "./schedulers";

const spotifyManager = new SpotifyManager();

dispatcher.onNewMessage(
  filters.and(filters.chat("private"), filters.not(filters.me), isViaOdesliBot),
  async (msg) => await odesli(msg),
);

dispatcher.onNewMessage(
  filters.and(filters.chat("private"), filters.not(filters.me), isHaveUrlEntities),
  async (msg, state: UpdateState<{}>) => await urlLinks(msg, state),
);

schedule("0 * * * *", async () => await spotifyManager.synchronize());
schedule("*/5 * * * *", async () => await processQueue(spotifyManager));

client.run({ session: env.TG_SESSION }, async () => {
  if (env.SAVE_SESSION) {
    await saveSession();
  }

  await spotifyManager.synchronize();

  console.log("🚀 SpotiGram ready to use");
});

dispatcher.onError(async (error, update, state) => {
  console.error("⚠️ Dispatcher error:", error, update.data);

  return true;
});

process.on("uncaughtException", (err) => console.error(err));
process.on("unhandledRejection", (err) => console.error(err));
