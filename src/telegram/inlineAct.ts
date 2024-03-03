import { tl } from "@mtcute/node";
import { toInputUser } from "@mtcute/node/utils.js";
import { client } from "./client.js";

export async function inlineAct(query: string, botUsername: string, offset: string = "") {
  let [botPeer, clientPeer] = await Promise.all([client.resolvePeer(botUsername), client.resolvePeer("me")]);

  const call = await client.call<tl.messages.RawGetInlineBotResultsRequest>({
    _: "messages.getInlineBotResults",
    bot: toInputUser(botPeer),
    peer: clientPeer,
    query,
    offset,
  });

  return call;
}
