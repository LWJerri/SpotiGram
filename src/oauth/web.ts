import { randomUUID } from "crypto";
import fastify from "fastify";
import open from "open";
import { exit, stdout } from "process";
import { header } from "../spotify/index.js";

const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REDIRECT_URL } = process.env;

const openUrlQuery = new URLSearchParams({
  response_type: "code",
  client_id: process.env.SPOTIFY_CLIENT_ID!,
  scope: [
    "playlist-read-private",
    "user-read-currently-playing",
    "user-read-recently-played",
    "user-read-playback-state",
    "user-modify-playback-state", // Require Premium account.
    "playlist-modify-public",
    "playlist-modify-private",
  ].join(" "),
  redirect_uri: process.env.SPOTIFY_REDIRECT_URL!,
  state: randomUUID(),
});

const app = fastify();

app.get<{
  Querystring?: { code?: string; state?: string; error?: string };
}>("/", async (req, res) => {
  if (req.query?.error) {
    await res.code(400).send(`Some error happens: ${req.query.error}.`);

    return;
  }

  if (!req.query?.code || !req.query.state) {
    await res.code(400).send('Missing "code" or "state" query.');

    return;
  }

  try {
    const request = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      body: new URLSearchParams({
        code: req.query.code,
        redirect_uri: SPOTIFY_REDIRECT_URL!,
        grant_type: "authorization_code",
      }),
      headers: {
        Authorization: header(SPOTIFY_CLIENT_ID!, SPOTIFY_CLIENT_SECRET!),
      },
    });

    if (request.status !== 200) {
      await res.code(400).send("Can't retrieve access token, response status is not 200.");

      return;
    }

    const { refresh_token } = await request.json();

    stdout.write(refresh_token);

    await res.send("You can close window, token saved to .env file.");

    exit(0);
  } catch (err) {
    console.error("Can't finish request to Spotify", err);

    await res.code(500).send("Can't process request to Spotify...");

    exit(1);
  }
});

await app.listen({ port: 3000, host: "0.0.0.0" });

await open(`https://accounts.spotify.com/authorize?${openUrlQuery}`);
