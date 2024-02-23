import { env } from "../config/index.js";
import authHeader from "../helpers/authHeader.js";

export async function refresher() {
  {
    const request = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: { Authorization: authHeader(env.SPOTIFY_CLIENT_ID, env.SPOTIFY_CLIENT_SECRET) },
      body: new URLSearchParams({ grant_type: "refresh_token", refresh_token: env.SPOTIFY_REFRESH_TOKEN }),
    });

    if (request.status !== 200) throw new Error("Can't retrieve new access token");

    const { access_token } = await request.json();

    return access_token;
  }
}
