import { Dispatcher, MemoryStateStorage } from "@mtcute/dispatcher";
import { telegram } from "./telegram.js";

export const dispatcher = Dispatcher.for(telegram, {
  storage: new MemoryStateStorage(),
});
