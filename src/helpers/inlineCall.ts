import { tl, toInputUser } from "@mtcute/node";
import { client } from "../mtcute";

export default async function inlineCall(query: string, botId: string | number, offset: string = "") {
  try {
    const [botPeer, clientPeer] = await Promise.all([client.resolvePeer(botId), client.resolvePeer("me")]);

    const call = await client.call<tl.messages.RawGetInlineBotResultsRequest>({
      _: "messages.getInlineBotResults",
      bot: toInputUser(botPeer),
      peer: clientPeer,
      query,
      offset,
    });

    return call;
  } catch (err) {
    console.error("Can't make inline call", err);
    return null;
  }
}
