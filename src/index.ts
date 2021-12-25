import { main } from "./db";
import { config } from "dotenv";
import { Telegraf } from "telegraf";

config();

main().catch(console.error);

const { BOT_TOKEN } = process.env;

if (!BOT_TOKEN) {
  console.error("BOT_TOKEN is not defined in enviroment");
  process.exit();
}

const bot = new Telegraf(BOT_TOKEN);
bot.start((ctx) => ctx.reply("Welcome"));
bot.help((ctx) => ctx.reply("Send me a sticker"));
bot.on("sticker", (ctx) => ctx.reply("👍"));
bot.hears("hi", (ctx) => ctx.reply("Hey there"));
bot.launch();

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
