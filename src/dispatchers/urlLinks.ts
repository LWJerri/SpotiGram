import { UpdateState } from "@mtcute/dispatcher";
import { isSpotifyUrl } from "../filters";
import { ODESLI_BOT_ID, SPOTIFY_TRACK_ID_REGEXP } from "../helpers/constants";
import inlineCall from "../helpers/inlineCall";
import { SpotifyManager } from "../manager";
import { CustomMessage } from "../types";

export async function urlLinks<T extends CustomMessage>(msg: T, state: UpdateState<{}>) {
  const spotifyManager = new SpotifyManager();

  let trackListIds = [];

  for (let i = 0; i < msg.urlEntities.length; i++) {
    await state.throttle("inlineCallsCycle", 5, 10);

    const inlineCallResult = await inlineCall(msg.urlEntities[i].text, ODESLI_BOT_ID);
    const inlineResult = inlineCallResult?.results.pop();

    if (inlineResult?.sendMessage._ !== "botInlineMessageText" || !inlineResult.sendMessage.entities?.length) {
      continue;
    }

    const spotifyEntity = inlineResult.sendMessage.entities.find(
      (entity) => entity._ === "messageEntityTextUrl" && isSpotifyUrl(entity.url),
    );

    if (spotifyEntity?._ !== "messageEntityTextUrl") continue;

    const [trackId] = spotifyEntity.url.match(SPOTIFY_TRACK_ID_REGEXP)!;

    trackListIds.push(trackId);
  }

  if (!trackListIds.length) return;

  await spotifyManager.process([...new Set(trackListIds)], msg.chat.id);
}
