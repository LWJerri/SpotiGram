import { readFile } from "fs/promises";
import { PackageJson } from "type-fest";

const SPOTIFY_TRACK_ID_REGEXP = /[^/]+$/;
const packageJson: PackageJson = JSON.parse(await readFile("package.json", { encoding: "utf8" }));

const ODESLI_BOT_ID = 899433974;
const ODESLI_BOT_USERNAME = "odesli_bot";

export { ODESLI_BOT_ID, ODESLI_BOT_USERNAME, SPOTIFY_TRACK_ID_REGEXP, packageJson };
