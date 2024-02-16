export default function basicAuthHeader(clientId: string, clientSecret: string) {
  const prepareBuffer = Buffer.from(`${clientId}:${clientSecret}`);

  return `Basic ${prepareBuffer.toString("base64")}`;
}
