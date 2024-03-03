import { md } from "@mtcute/node";
import { Prisma } from "@prisma/client";
import {
  SpotifyClient,
  SpotifyError,
  addItemToPlaybackQueue,
  addItemToPlaylist,
  getCurrentUser,
  getPlaylist,
  getPlaylistTracks,
  getTrack,
  getUserQueue,
} from "@soundify/web-api";
import { PageIterator } from "@soundify/web-api/pagination";
import { randomUUID } from "crypto";
import { EOL } from "os";
import { environment } from "../config/environment.js";
import { prisma } from "../db/prisma.js";
import { client } from "../telegram/index.js";
import { refresher } from "./refresher.js";

const SPECIAL_EMPTY_SYMBOL = "⠀";

export class SpotifyManager {
  private spotify = new SpotifyClient(randomUUID(), { waitForRateLimit: true, refresher });
  private response = ["**SpotiGram ⭐**", SPECIAL_EMPTY_SYMBOL];

  async synchronize() {
    const [databasePlaylist, spotifyPlaylist] = await Promise.all([
      prisma.playlist.findUnique({ where: { id: environment.SPOTIFY_PLAYLIST_ID } }),
      getPlaylist(this.spotify, environment.SPOTIFY_PLAYLIST_ID),
    ]);

    if (databasePlaylist?.snapshotId === spotifyPlaylist?.snapshot_id) return;

    const playlistTracksIterator = new PageIterator((offset) =>
      getPlaylistTracks(this.spotify, environment.SPOTIFY_PLAYLIST_ID, { limit: 50, offset }),
    );

    const playlistTracksList = await playlistTracksIterator.collect();

    const preparedTracksList: Prisma.TrackCreateManyInput[] = playlistTracksList.map(({ added_at, track }) => {
      return { trackId: track.id, addedAt: added_at, name: track.name };
    });

    const { snapshot_id: snapshotId } = spotifyPlaylist;

    await prisma.$transaction([
      prisma.playlist.upsert({
        where: { id: environment.SPOTIFY_PLAYLIST_ID },
        create: { id: environment.SPOTIFY_PLAYLIST_ID, snapshotId },
        update: { snapshotId },
      }),
      prisma.track.deleteMany(),
      prisma.track.createMany({ data: preparedTracksList }),
    ]);
  }

  async addQueuedTrack(trackUri: string) {
    await addItemToPlaybackQueue(this.spotify, trackUri);
  }

  async process(trackIds: string[], chatId: string | number) {
    const message = await client.sendText(chatId, md(this.response.join(EOL)));

    for (const trackId of trackIds) {
      const [track, isTrackAlreadyInQueue, isClientPremium] = await Promise.all([
        this.getTrackById(trackId),
        this.isTrackInQueue(trackId),
        this.isClientPremium(),
      ]);

      this.response.push(`**${track.name}**`);

      if (!track.existsInDatabase) {
        await this.addTrackToPlaylist(trackId, track.name);
      } else {
        this.response.push(` ▹ already in playlist.`);
      }

      if (isTrackAlreadyInQueue) {
        this.response.push(` ▹ already in queue.`);
      }

      if (isClientPremium) {
        const trackUri = `spotify:track:${trackId}`;

        await this.addTrackToQueue(trackUri);
      }

      this.response.push(SPECIAL_EMPTY_SYMBOL);

      await client.editMessage({ message, text: md(this.response.join(EOL)) });
    }

    this.response.push(`◽ open.spotify.com/playlist/${environment.SPOTIFY_PLAYLIST_ID}`);

    return await client.editMessage({ message, text: md(this.response.join(EOL)) });
  }

  private async isClientPremium() {
    const { product } = await getCurrentUser(this.spotify);

    return product === "premium";
  }

  private async getTrackById(trackId: string) {
    let response: { name: string; existsInDatabase: boolean };

    const findTrack = await prisma.track.findFirst({ where: { trackId } });

    if (findTrack) {
      response = { name: findTrack.name, existsInDatabase: true };
    } else {
      const { name } = await getTrack(this.spotify, trackId);

      response = { name, existsInDatabase: false };
    }

    return response;
  }

  private async isTrackInQueue(trackId: string) {
    const { currently_playing, queue } = await getUserQueue(this.spotify);

    return currently_playing?.id === trackId || queue.find(({ id }) => trackId === id);
  }

  private async addTrackToQueue(trackUri: string) {
    try {
      await addItemToPlaybackQueue(this.spotify, trackUri);

      this.response.push(" ▹ added to queue.");
    } catch (err) {
      if (err instanceof SpotifyError && err.status === 404) {
        await prisma.trackQueue.upsert({ where: { trackUri }, create: { trackUri }, update: {} });

        this.response.push(" ▹ added to queue and will be played when some device will be available.");
      } else {
        console.error(err);

        this.response.push(" ▹ some error happens when adding track to queue.");
      }
    }
  }

  private async addTrackToPlaylist(trackId: string, name: string) {
    try {
      const { snapshot_id: snapshotId } = await addItemToPlaylist(
        this.spotify,
        environment.SPOTIFY_PLAYLIST_ID,
        `spotify:track:${trackId}`,
      );

      await prisma.$transaction([
        prisma.playlist.update({ where: { id: environment.SPOTIFY_PLAYLIST_ID }, data: { snapshotId } }),
        prisma.track.create({ data: { trackId, name } }),
      ]);

      this.response.push(" ▹ added to playlist.");
    } catch (err) {
      console.error(err);

      this.response.push(" ▹ some error happens when adding track to playlist.");
    }
  }
}
