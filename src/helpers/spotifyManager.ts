import { NewMessageEvent } from "telegram/events";
import { telegram } from "../app";
import { SPOTIFY_API_URL } from "./constants";

const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN, SPOTIFY_PLAYLIST_ID } = process.env;

export async function spotifyManager(event: NewMessageEvent, spotifyParsedIds: Array<string>) {
  const getSpotifyToken = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ grant_type: "refresh_token", refresh_token: SPOTIFY_REFRESH_TOKEN }),
  });

  const { access_token } = await getSpotifyToken.json();

  if (!access_token) return;

  const headers = { "Content-Type": "application/json", Authorization: `Bearer ${access_token}` };

  const queryParams = new URLSearchParams({
    limit: "50",
    fields: "next,items(track(id))",
  });

  let responseMessage = ["**Spotify Song Manager:**"];

  for (let i = 0; i < spotifyParsedIds.length; i++) {
    const songId = spotifyParsedIds[i];

    let isTrackAlreadyExsist = false;
    let isLastPage = false;

    let spotifySearchAPI = `${SPOTIFY_API_URL}/playlists/${SPOTIFY_PLAYLIST_ID}/tracks?${queryParams}`;

    while (!isLastPage) {
      const request = await fetch(spotifySearchAPI, { headers });
      const response: { items: Array<{ track: { id: string } }>; next?: string } = await request.json();

      const findTrack = response.items.find(({ track }) => track.id === songId);

      if (findTrack) {
        isTrackAlreadyExsist = true;
        isLastPage = true;
      }

      if (!response?.next) {
        isLastPage = true;
      } else {
        spotifySearchAPI = response.next;
      }
    }

    const songInfoRequest = await fetch(`${SPOTIFY_API_URL}/tracks/${songId}`, { headers });
    const { name: songName } = await songInfoRequest.json();

    if (!isTrackAlreadyExsist) {
      const addToPlaylistRequest = await fetch(
        `${SPOTIFY_API_URL}/playlists/${SPOTIFY_PLAYLIST_ID}/tracks?uris=spotify:track:${songId}`,
        { method: "POST", headers },
      );

      if (addToPlaylistRequest.status === 201) {
        responseMessage.push(`✅ Song ${songName} added to playlist.`);
      } else {
        const { error } = await addToPlaylistRequest.json();

        responseMessage.push(`⚠️ Can't add song ${songName} to playlist! Error: ${error}`);
      }
    } else {
      responseMessage.push(`⚠️ Song ${songName} already added to playlist.`);
    }

    const queueListRequest = await fetch("https://api.spotify.com/v1/me/player/queue", { headers });
    const queueListResponse: { queue: Array<{ id: string }> } = await queueListRequest.json();

    const findTrackInQueue = queueListResponse?.queue?.find(({ id }) => id === songId);

    if (!findTrackInQueue) {
      const addToQueueRequest = await fetch(`${SPOTIFY_API_URL}/me/player/queue?uri=spotify:track:${songId}`, {
        method: "POST",
        headers,
      });

      if (addToQueueRequest.status === 204) {
        responseMessage.push(`✅ Song ${songName} added to current player queue.`);
      } else {
        const { error } = await addToQueueRequest.json();

        responseMessage.push(`⚠️ Can't add song ${songName} to player queue! Error: ${error}`);
      }
    } else {
      responseMessage.push(`⚠️ Song ${songName} already added to player queue.`);
    }

    responseMessage.push("");
  }

  responseMessage.push(`https://open.spotify.com/playlist/${SPOTIFY_PLAYLIST_ID}`);

  await telegram.sendMessage(event.message.chatId, {
    message: responseMessage.join("\n"),
    parseMode: "markdown",
  });
}
