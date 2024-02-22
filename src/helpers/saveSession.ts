import { client } from "../mtcute/index.js";
import { env } from "./env.js";
import updateEnv from "./updateEnv.js";

export default async function saveSession() {
  const SESSION_KEY: keyof typeof env = "TG_SESSION";

  const sessionString = await client.exportSession();

  if (env[SESSION_KEY] === sessionString) return;

  await updateEnv(SESSION_KEY, sessionString);

  console.log("Session key saved to .env");
}
