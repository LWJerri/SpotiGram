import { tl } from "@mtcute/node";
import { toInputUser } from "@mtcute/node/utils.js";
import { client } from "./index.js";

export async function inlineAct(query: string, botId: string | number, offset: string = "") {
  const [botPeer, clientPeer] = await Promise.all([client.resolvePeer(botId), client.resolvePeer("me")]);

  const call = await client.call<tl.messages.RawGetInlineBotResultsRequest>({
    _: "messages.getInlineBotResults",
    bot: toInputUser(botPeer),
    peer: clientPeer,
    query,
    offset,
  });

  return call;
}
