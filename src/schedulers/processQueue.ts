import { SpotifyError } from "@soundify/web-api";
import { prisma } from "../helpers/prisma.js";
import { SpotifyManager } from "../manager.js";

export async function processQueue(spotifyManager: SpotifyManager) {
  const queueTrackList = await prisma.trackQueue.findMany();

  for (const track of queueTrackList) {
    try {
      await spotifyManager.addQueuedTrack(track.trackUri);

      await prisma.trackQueue.delete({ where: { id: track.id } });
    } catch (err) {
      if (err instanceof SpotifyError && err.status === 404) continue;

      console.error(err);

      continue;
    }
  }
}
