import { config } from "dotenv";
import { readFileSync } from "fs";
import { writeFile } from "fs/promises";
import { EOL } from "os";

config({ override: true });

export default async function updateEnv(key: string, value: string) {
  try {
    const readEnvPairs = readFileSync(".env", { encoding: "utf8" }).split(EOL);
    const getPairIndex = readEnvPairs.findIndex((pair) => pair.startsWith(key));

    readEnvPairs[getPairIndex] = `${key}=${value}`;

    process.env[key] = value;

    await writeFile(".env", readEnvPairs.join(EOL), "utf8");
  } catch (err) {
    console.error("Can't update .env & runtime process.env.", err);
  }
}
