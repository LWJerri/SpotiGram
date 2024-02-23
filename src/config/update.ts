import { config } from "dotenv";
import { readFile, writeFile } from "fs/promises";
import { EOL } from "os";

config({ override: true });

export default async function update(key: string, value: string) {
  const preReadEnvPairs = await readFile(".env", { encoding: "utf8" });
  const readEnvPairs = preReadEnvPairs.split(EOL);
  const getPairIndex = readEnvPairs.findIndex((pair) => pair.startsWith(key));

  readEnvPairs[getPairIndex] = `${key}=${value}`;

  process.env[key] = value;

  await writeFile(".env", readEnvPairs.join(EOL), "utf8");
}
