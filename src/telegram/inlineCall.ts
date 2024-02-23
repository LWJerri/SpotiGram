import { tl } from "@mtcute/node";
import { toInputUser } from "@mtcute/node/utils.js";
import { telegram } from "./index.js";

export default async function inlineCall(query: string, botId: string | number, offset: string = "") {
  const [botPeer, clientPeer] = await Promise.all([telegram.resolvePeer(botId), telegram.resolvePeer("me")]);

  const call = await telegram.call<tl.messages.RawGetInlineBotResultsRequest>({
    _: "messages.getInlineBotResults",
    bot: toInputUser(botPeer),
    peer: clientPeer,
    query,
    offset,
  });

  return call;
}
