import "dotenv/config";
import { TelegramClient } from "telegram";
import { NewMessage, NewMessageEvent } from "telegram/events";
import { StringSession } from "telegram/sessions";
import { DEVICE_MODEL, SPOTIFY_REGEXP, SPOTIFY_TRACK_REGEXP } from "./helpers/constants";
import { spotifyManager } from "./helpers/spotifyManager";

const { APP_ID, APP_HASH, SESSION } = process.env;

const stringSession = new StringSession(SESSION);

export const telegram = new TelegramClient(stringSession, parseInt(APP_ID), APP_HASH, { deviceModel: DEVICE_MODEL });

async function startClient() {
  await telegram.connect();

  console.log("Connected to User API server!");

  const meMessage = await telegram.sendMessage("me", { message: DEVICE_MODEL });
  await meMessage.delete();

  console.log("Now, script ready to listen all actions from connected client...");

  telegram.addEventHandler(messageEvent, new NewMessage());

  async function messageEvent(event: NewMessageEvent) {
    if (!event.isPrivate) return;

    const getCurrentUser = await telegram.getMe();
    const clientId = getCurrentUser.CONSTRUCTOR_ID === 2880827680 && getCurrentUser.id.toJSNumber();

    const { message, originalUpdate } = event;

    const getMessageAuthorId =
      originalUpdate.CONSTRUCTOR_ID === 522914557 &&
      originalUpdate.message.peerId.className === "PeerUser" &&
      originalUpdate.message.peerId.userId.toJSNumber();

    const isMessageFromClient =
      originalUpdate.CONSTRUCTOR_ID === 522914557 &&
      originalUpdate.message.CONSTRUCTOR_ID === 940666592 &&
      originalUpdate.message.fromId?.className === "PeerUser" &&
      originalUpdate.message.fromId?.userId?.toJSNumber();

    if (clientId !== getMessageAuthorId && event.message.entities?.length && !Boolean(isMessageFromClient)) {
      const spotifyParsedIds =
        event.message.entities
          .filter((entity) => {
            const isSpotifyEntity =
              entity.className === "MessageEntityTextUrl" && SPOTIFY_TRACK_REGEXP.test(entity.url);

            return entity.className === "MessageEntityUrl" || isSpotifyEntity;
          })
          .filter((entity) => {
            if (entity.className === "MessageEntityUrl") {
              return SPOTIFY_REGEXP.test(message.text.slice(entity.offset, entity.offset + entity.length));
            } else {
              return entity;
            }
          })
          .map((entity) => {
            if (entity.className === "MessageEntityTextUrl") {
              return entity.url.replace(SPOTIFY_TRACK_REGEXP, "");
            } else {
              const [spotifyURL] = message.text
                .slice(entity.offset, entity.offset + entity.length)
                .match(SPOTIFY_REGEXP);

              const spotifySongId = spotifyURL.replace(SPOTIFY_TRACK_REGEXP, "");

              return spotifySongId;
            }
          }) ?? [];

      if (spotifyParsedIds.length > 0) {
        return await spotifyManager(event, [...new Set(spotifyParsedIds)]);
      }
    }
  }
}

startClient();
