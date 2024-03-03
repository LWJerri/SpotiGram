import { spawn } from "child_process";

export async function oauth(isDev: boolean) {
  const data: { cmd: string; args: string[] } = {
    cmd: isDev ? "tsx" : "node",
    args: isDev ? ["./src/oauth/web.ts"] : ["./dist/oauth/web.js"],
  };

  let streamData = "";

  await new Promise((resolve, reject) => {
    const child = spawn(data.cmd, data.args);

    child.stdout.on("data", (data) => {
      streamData += data.toString();
    });

    child.on("exit", () => resolve(child));
    child.on("error", (error) => reject(error));
  });

  return streamData;
}
