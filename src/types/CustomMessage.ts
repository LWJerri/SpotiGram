import { Message, MessageEntity } from "@mtcute/node";

export type CustomMessage = Message & { urlEntities: MessageEntity[] };
