import { spawn } from "child_process";

export async function oauth() {
  let streamData = "";

  await new Promise((resolve, reject) => {
    spawn("pnpm", ["build"]);

    const child = spawn("node", ["./dist/oAuth.js"]);

    child.stdout.on("data", (data) => {
      streamData += data.toString();
    });

    child.on("exit", () => resolve(child));

    child.on("error", (error) => reject(error));
  });

  return streamData;
}
