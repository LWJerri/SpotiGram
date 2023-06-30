import "dotenv/config";
import input from "input";
import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions";

const { APP_ID, APP_HASH } = process.env;

(async () => {
  const client = new TelegramClient(new StringSession(""), parseInt(APP_ID), APP_HASH, {
    deviceModel: "User API [Login]",
  });

  await client.start({
    phoneNumber: async () => await input.text("Enter your phone number: "),
    password: async () => await input.text("Enter your password: "),
    phoneCode: async () => await input.text("Enter your code from Telegram: "),
    onError: (err) => console.log(err),
  });

  console.log(`Save this to SESSION .env key:`, client.session.save());
})();
