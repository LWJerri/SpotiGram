import { environment, update } from "../config/index.js";
import { client } from "./index.js";

export async function session() {
  const SESSION_KEY: keyof typeof environment = "TG_SESSION";

  const sessionString = await client.exportSession();

  if (environment[SESSION_KEY] === sessionString) return;

  await update(SESSION_KEY, sessionString);

  console.log("Session key saved to .env");
}
