import { bool, customCleanEnv, num, str, url } from "envalid";
import { oauth } from "../oauth/index.js";
import { alphanum, update } from "./index.js";

export const environment = await customCleanEnv(
  process.env,
  {
    TG_API_ID: num(),
    TG_API_HASH: alphanum(),
    SAVE_SESSION: bool(),
    TG_SESSION: str(),
    SPOTIFY_CLIENT_ID: alphanum(),
    SPOTIFY_CLIENT_SECRET: alphanum(),
    SPOTIFY_REFRESH_TOKEN: str(),
    SPOTIFY_REDIRECT_URL: url(),
    SPOTIFY_PLAYLIST_ID: alphanum(),
    DATABASE_URL: alphanum(),
  },
  async (environment) => {
    const SPOTIFY_TOKEN_KEY: keyof typeof environment = "SPOTIFY_REFRESH_TOKEN";

    if (!environment[SPOTIFY_TOKEN_KEY]) {
      try {
        const token = await oauth();

        await update(SPOTIFY_TOKEN_KEY, token);

        Object.assign(environment, { SPOTIFY_REFRESH_TOKEN: token });
      } catch (err) {
        throw err;
      }
    }

    return environment;
  },
);
