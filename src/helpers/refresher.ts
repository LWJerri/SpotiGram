import { RefreshTokenResponse } from "../interfaces/index.js";
import basicAuthHeader from "./basicAuthHeader.js";
import { env } from "./env.js";

export default async function refresher(): Promise<string> {
  const request = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { Authorization: basicAuthHeader(env.SPOTIFY_CLIENT_ID, env.SPOTIFY_CLIENT_SECRET) },
    body: new URLSearchParams({ grant_type: "refresh_token", refresh_token: env.SPOTIFY_REFRESH_TOKEN }),
  });

  if (request.status !== 200) throw new Error("Can't retrieve new access token");

  const { access_token }: RefreshTokenResponse = await request.json();

  return access_token;
}
