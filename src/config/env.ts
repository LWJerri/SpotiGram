import { bool, customCleanEnv, makeValidator, num, str, url } from "envalid";
import childProcess from "../oauth/process.js";
import updateEnv from "./update.js";

const alphanum = makeValidator((value) => {
  if (typeof value !== "string" || !value.length) throw new Error("Value must be a non-empty string");

  return value;
});

export const env = await customCleanEnv(
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
  async (env) => {
    const SPOTIFY_TOKEN_KEY: keyof typeof env = "SPOTIFY_REFRESH_TOKEN";

    if (!env[SPOTIFY_TOKEN_KEY]) {
      try {
        const token = await childProcess();

        await updateEnv(SPOTIFY_TOKEN_KEY, token);

        Object.assign(env, { SPOTIFY_REFRESH_TOKEN: token });
      } catch (err) {
        throw err;
      }
    }

    return env;
  },
);
