import { main } from "./db";
import { config } from "dotenv";
import { Telegraf, Markup } from "telegraf";

config();

const { BOT_TOKEN, MONGO_DB_USER, MONGO_DB_PASSWORD } = process.env;

main(MONGO_DB_USER, MONGO_DB_PASSWORD).catch(console.error);

if (!BOT_TOKEN) {
  console.error("BOT_TOKEN is not defined in enviroment");
  process.exit();
}

const keyboard = Markup.inlineKeyboard([
  Markup.button.callback("Ответить ↩️", "answer"),
  Markup.button.callback("Скачать ⬇️", "download"),
]);

const bot = new Telegraf(BOT_TOKEN);
bot.start((ctx) => ctx.reply(`Deep link payload: ${ctx.startPayload}`))
bot.help((ctx) => ctx.reply("Send me a sticker"));
bot.on("text", (ctx) => {
  console.log(ctx.update);
  ctx.replyWithChatAction("typing");
  ctx.replyWithPhoto(`https://cataas.com/cat/says/${encodeURI(ctx.message.text)}`, keyboard);
});
bot.action('answer', (ctx)=>{
  ctx.reply("Напиши твой ответ:");
})

bot.launch().then(()=>{
  console.log('bot started');
});

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
