import { UpdateFilter } from "@mtcute/dispatcher";
import { Message } from "@mtcute/node";

export const isHaveUrlEntities: UpdateFilter<Message> = (msg) => {
  const urlEntitiesList = msg.entities.filter((entity) => entity.kind === "url");

  if (!urlEntitiesList.length) return false;

  return true;
};
