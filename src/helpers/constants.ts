import { readFile } from "fs/promises";
import { PackageJson } from "type-fest";

const SPOTIFY_TRACK_ID_REGEXP = /[^/]+$/;
const ODESLI_BOT_ID = 899433974;
const packageJson: PackageJson = JSON.parse(await readFile("package.json", { encoding: "utf8" }));

export { ODESLI_BOT_ID, SPOTIFY_TRACK_ID_REGEXP, packageJson };
