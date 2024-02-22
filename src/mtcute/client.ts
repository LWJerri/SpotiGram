import { NodeTelegramClient } from "@mtcute/node";
import { env } from "../helpers/env.js";

export const client = new NodeTelegramClient({
  apiId: env.TG_API_ID,
  apiHash: env.TG_API_HASH,
  storage: "spotigram.session",
  // initConnectionOptions: {
  // deviceModel: name,
  // appVersion: version,
  // },
});
