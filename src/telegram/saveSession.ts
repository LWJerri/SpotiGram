import { env } from "../config/env.js";
import updateEnv from "../config/update.js";
import { telegram } from "./telegram.js";

export default async function saveSession() {
  const SESSION_KEY: keyof typeof env = "TG_SESSION";

  const sessionString = await telegram.exportSession();

  if (env[SESSION_KEY] === sessionString) return;

  await updateEnv(SESSION_KEY, sessionString);

  console.log("Session key saved to .env");
}
