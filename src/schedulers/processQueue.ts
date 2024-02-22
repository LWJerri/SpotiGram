import { SpotifyError } from "@soundify/web-api";
import { prisma } from "../helpers/prisma";
import { SpotifyManager } from "../manager";

export async function processQueue(spotifyManager: SpotifyManager) {
  const queueTrackList = await prisma.trackQueue.findMany();

  for (let i = 0; i < queueTrackList.length; i++) {
    const { id, trackUri } = queueTrackList[i];

    try {
      await spotifyManager.addQueuedTrack(trackUri);

      await prisma.trackQueue.delete({ where: { id } });
    } catch (err) {
      if (err instanceof SpotifyError && err.status === 404) continue;

      console.error(err);

      continue;
    }
  }
}
