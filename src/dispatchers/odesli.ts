import { Message } from "@mtcute/core";
import { isSpotifyUrl } from "../filters/index.js";
import { SPOTIFY_TRACK_ID_REGEXP } from "../helpers/constants.js";
import { SpotifyManager } from "../manager.js";

export async function odesli<T extends Message>(msg: T) {
  const spotifyManager = new SpotifyManager();

  const spotifyUrlEntity = msg.entities.find(({ params }) => params.kind === "text_link" && isSpotifyUrl(params.url));

  if (!spotifyUrlEntity || !spotifyUrlEntity.is("text_link")) return;

  const [trackId] = spotifyUrlEntity.params.url.match(SPOTIFY_TRACK_ID_REGEXP)!;

  await spotifyManager.process([trackId], msg.chat.id);
}
