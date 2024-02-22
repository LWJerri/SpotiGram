import { UpdateFilter } from "@mtcute/dispatcher";
import { Message } from "@mtcute/node";
import { ODESLI_BOT_ID } from "../helpers/constants";

export const isViaOdesliBot: UpdateFilter<Message> = (msg) => Boolean(msg.viaBot && msg.viaBot.id === ODESLI_BOT_ID);
