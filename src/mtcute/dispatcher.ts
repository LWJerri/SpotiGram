import { Dispatcher } from "@mtcute/dispatcher";
import { MemoryStorage } from "@mtcute/node";
import { client } from "./client";

export const dispatcher = Dispatcher.for(client, { storage: new MemoryStorage() });
