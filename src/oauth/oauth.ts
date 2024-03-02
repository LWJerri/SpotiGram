import { spawn } from "child_process";
import { environment } from "../config/index.js";

export async function oauth() {
  const data: { cmd: string; args: string[] } = {
    cmd: environment.isDev ? "tsx" : "node",
    args: environment.isDev ? ["./src/oauth/web.ts"] : ["./dist/oauth/web.js"],
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
