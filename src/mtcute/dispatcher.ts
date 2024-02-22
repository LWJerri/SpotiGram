import { Dispatcher, MemoryStateStorage } from "@mtcute/dispatcher";
import { client } from "./client.js";

export const dispatcher = Dispatcher.for(client, {
  storage: new MemoryStateStorage(),
});
