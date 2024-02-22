import { UpdateState, filters } from "@mtcute/dispatcher";
import "dotenv/config";
import { schedule } from "node-cron";
import { odesli, urlLinks } from "./dispatchers/index.js";
import { isHaveUrlEntities, isViaOdesliBot } from "./filters/index.js";
import { env } from "./helpers/env.js";
import saveSession from "./helpers/saveSession.js";
import { SpotifyManager } from "./manager.js";
import { client, dispatcher } from "./mtcute/index.js";
import { processQueue } from "./schedulers/index.js";

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

if (env.SAVE_SESSION) {
  try {
    await saveSession();
  } catch (err) {
    console.error("Can't save session string.", err);
  }
}

await spotifyManager.synchronize();

client.run({ session: env.TG_SESSION }, async () => {
  console.log("🚀 SpotiGram ready to use");
});

dispatcher.onError(async (error, update, state) => {
  console.error("⚠️ Dispatcher error:", error, update.data);

  return true;
});

process.on("uncaughtException", (err) => console.error(err));
process.on("unhandledRejection", (err) => console.error(err));
