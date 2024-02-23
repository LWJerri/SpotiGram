import { UpdateFilter } from "@mtcute/dispatcher";
import { Message } from "@mtcute/node";

export const isIncludesUrlEntities: UpdateFilter<Message> = (msg) => {
  const urlEntitiesList = msg.entities.filter((entity) => entity.kind === "url");

  return Boolean(urlEntitiesList.length);
};
