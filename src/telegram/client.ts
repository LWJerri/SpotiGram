import { NodeTelegramClient } from "@mtcute/node";
import { environment } from "../config/environment.js";
import { packageJson } from "../helpers/constants.js";

export const client = new NodeTelegramClient({
  apiId: environment.TG_API_ID,
  apiHash: environment.TG_API_HASH,
  storage: "spotigram.session",
  initConnectionOptions: {
    appVersion: packageJson.version,
    deviceModel: packageJson.name,
  },
});
