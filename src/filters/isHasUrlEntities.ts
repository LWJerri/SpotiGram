import { Message } from "@mtcute/core";
import { UpdateFilter } from "@mtcute/dispatcher";

export const isHasUrlEntities: UpdateFilter<Message> = (msg) => {
  const urlEntitiesList = msg.entities.filter((entity) => entity.kind === "url");

  return Boolean(urlEntitiesList.length);
};
