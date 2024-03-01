import { Message } from "@mtcute/core";
import { UpdateFilter } from "@mtcute/dispatcher";
import { ODESLI_BOT_ID } from "../helpers/index.js";

export const isViaOdesliBot: UpdateFilter<Message> = (msg) => !!msg.viaBot && msg.viaBot.id === ODESLI_BOT_ID;
