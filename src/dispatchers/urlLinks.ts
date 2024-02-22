import { Message, tl } from "@mtcute/core";
import { UpdateState } from "@mtcute/dispatcher";
import { isSpotifyUrl } from "../filters/index.js";
import { ODESLI_BOT_ID, SPOTIFY_TRACK_ID_REGEXP } from "../helpers/constants.js";
import inlineCall from "../helpers/inlineCall.js";
import { SpotifyManager } from "../manager.js";

export async function urlLinks<T extends Message>(msg: T, state: UpdateState<{}>) {
  const urlEntitiesList = msg.entities.filter((entity) => entity.kind === "url");

  const spotifyManager = new SpotifyManager();

  const trackListIds = new Set<string>();

  for (const entity of urlEntitiesList) {
    await state.throttle("inlineCallsCycle", 5, 10);

    let inlineCallResult: tl.messages.RawBotResults;

    try {
      inlineCallResult = await inlineCall(entity.text, ODESLI_BOT_ID);
    } catch (err) {
      console.error(err);

      continue;
    }

    const inlineResult = inlineCallResult?.results.pop();

    if (inlineResult?.sendMessage._ !== "botInlineMessageText" || !inlineResult.sendMessage.entities?.length) {
      continue;
    }

    const spotifyEntity = inlineResult.sendMessage.entities.find((entity) => {
      return entity._ === "messageEntityTextUrl" && isSpotifyUrl(entity.url);
    });

    if (spotifyEntity?._ !== "messageEntityTextUrl") continue;

    const matchResult = spotifyEntity.url.match(SPOTIFY_TRACK_ID_REGEXP)!;

    if (!matchResult) continue;

    trackListIds.add(matchResult[0]);
  }

  if (!trackListIds.size) return;

  await spotifyManager.process([...trackListIds], msg.chat.id);
}
