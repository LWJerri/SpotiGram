import { Dispatcher } from "@mtcute/dispatcher";
import { client } from "./client";

export const dispatcher = Dispatcher.for(client);
