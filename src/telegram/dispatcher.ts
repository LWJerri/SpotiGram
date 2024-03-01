import { Dispatcher, MemoryStateStorage } from "@mtcute/dispatcher";
import { client } from "./index.js";

export const dispatcher = Dispatcher.for(client, {
  storage: new MemoryStateStorage(),
});
