import { UpdateFilter } from "@mtcute/dispatcher";
import { Message } from "@mtcute/node";
import { ODESLI_BOT_ID } from "../helpers/constants.js";

export const isViaOdesliBot: UpdateFilter<Message> = (msg) => !!msg.viaBot && msg.viaBot.id === ODESLI_BOT_ID;
