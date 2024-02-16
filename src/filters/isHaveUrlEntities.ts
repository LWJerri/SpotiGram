import { UpdateFilter } from "@mtcute/dispatcher";
import { Message, MessageEntity } from "@mtcute/node";
import { CustomMessage } from "../types";

export const isHaveUrlEntities: UpdateFilter<Message, { urlEntities: MessageEntity[] }> = (msg) => {
  const urlEntitiesList = msg.entities.filter((entity) => entity.kind === "url");

  if (!urlEntitiesList.length) return false;

  (msg as CustomMessage).urlEntities = urlEntitiesList;

  return true;
};
