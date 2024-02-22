import { NodeTelegramClient } from "@mtcute/node";
import { name, version } from "../../package.json";
import { env } from "../helpers/env";

export const client = new NodeTelegramClient({
  apiId: env.TG_API_ID,
  apiHash: env.TG_API_HASH,
  storage: "spotigram.session",
  initConnectionOptions: {
    deviceModel: name,
    appVersion: version,
  },
});
