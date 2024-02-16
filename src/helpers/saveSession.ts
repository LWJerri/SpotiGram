import { client } from "../mtcute";
import { env } from "./env";
import updateEnv from "./updateEnv";

export default async function saveSession() {
  const SESSION_KEY: keyof typeof env = "TG_SESSION";

  try {
    const sessionString = await client.exportSession();

    if (env[SESSION_KEY] === sessionString) return;

    await updateEnv(SESSION_KEY, sessionString);

    console.log("Session key saved to .env");
  } catch (err) {
    console.error("Can't save session string.", err);
  }
}
