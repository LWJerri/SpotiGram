import { Dispatcher, MemoryStateStorage } from "@mtcute/dispatcher";
import { client } from "./client";

export const dispatcher = Dispatcher.for(client, {
  storage: new MemoryStateStorage(),
});
