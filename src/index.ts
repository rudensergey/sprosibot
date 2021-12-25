import { main } from "./db";
import { config } from "dotenv";
import { Telegraf, Markup } from "telegraf";

config();

main().catch(console.error);

const { BOT_TOKEN } = process.env;

if (!BOT_TOKEN) {
  console.error("BOT_TOKEN is not defined in enviroment");
  process.exit();
}

const keyboard = Markup.inlineKeyboard([
  Markup.button.url("❤️", "http://telegraf.js.org"),
  Markup.button.callback("Delete", "delete"),
]);

const bot = new Telegraf(BOT_TOKEN);
bot.start((ctx) => ctx.reply("Welcome"));
bot.help((ctx) => ctx.reply("Send me a sticker"));
bot.on("sticker", (ctx) => ctx.reply("👍"));
bot.hears("hi", (ctx) => ctx.reply("Hey there"));
bot.on("message", (ctx) => {
  console.log(ctx.update);
  ctx.replyWithChatAction("typing");
  setTimeout(() => {
    ctx.telegram.sendCopy(ctx.message.chat.id, ctx.message, keyboard);
    ctx.replyWithPhoto("https://picsum.photos/200/300/");
  }, 2000);
});
bot.launch();

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
