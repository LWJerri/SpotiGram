import { spawn } from "child_process";

export default async function oAuthProcess() {
  let streamData = "";

  try {
    await new Promise((resolve, reject) => {
      const child = spawn("pnpm", ["tsx", "./src/oAuth.ts"]);

      child.stdout.on("data", (data) => {
        streamData += data.toString();
      });

      child.on("exit", () => resolve(child));

      child.on("error", (error) => reject(error));
    });

    return streamData;
  } catch (err) {
    console.error("Can't run oAuth process.", err);

    return null;
  }
}
