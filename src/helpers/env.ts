import { bool, customCleanEnv, num, str, url } from "envalid";
import { alphanum } from "../validators";
import childProcess from "./oAuthProcess";
import updateEnv from "./updateEnv";

export const env = await customCleanEnv(
  process.env,
  {
    TG_API_ID: num(),
    TG_API_HASH: alphanum(),
    SAVE_SESSION: bool(),
    TG_SESSION: str(),
    IS_SPOTIFY_PREMIUM: bool(),
    SPOTIFY_CLIENT_ID: alphanum(),
    SPOTIFY_CLIENT_SECRET: alphanum(),
    SPOTIFY_REFRESH_TOKEN: str(),
    SPOTIFY_REDIRECT_URL: url(),
    SPOTIFY_PLAYLIST_ID: alphanum(),
  },
  async (env) => {
    const SPOTIFY_TOKEN_KEY: keyof typeof env = "SPOTIFY_REFRESH_TOKEN";

    if (!env[SPOTIFY_TOKEN_KEY]) {
      const refreshToken = await childProcess();

      if (!refreshToken) throw new Error("Can't retrieve first refresh token");

      await updateEnv(SPOTIFY_TOKEN_KEY, refreshToken);

      Object.assign(env, { SPOTIFY_TOKEN_KEY: refreshToken });
    }

    return env;
  },
);
