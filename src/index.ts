import { config } from "dotenv";
import { Telegraf, Markup } from "telegraf";
import { MongoAPI } from "./db";
import { apiExample } from "./example";

// dotenv
config();

// env
const { BOT_TOKEN, MONGO_DB_USER, MONGO_DB_PASSWORD, MONGO_DB_CLUSTER } = process.env;

// database
const api = new MongoAPI(MONGO_DB_USER, MONGO_DB_PASSWORD, MONGO_DB_CLUSTER);
api.connectMongoDB().then((status) => status && runBot());

function runBot() {
  if (!BOT_TOKEN) {
    console.error("BOT_TOKEN is not defined in enviroment");
    process.exit();
  }

  const keyboard = Markup.inlineKeyboard([Markup.button.callback("Ответить ↩️", "answer"), Markup.button.callback("Скачать ⬇️", "download")]);

  const bot = new Telegraf(BOT_TOKEN);
  bot.start((ctx) => ctx.reply(`Deep link payload: ${ctx.startPayload}`));
  bot.help((ctx) => ctx.reply("Send me a sticker"));
  bot.on("text", (ctx) => {
    console.log(ctx.update);

    apiExample(api);

    ctx.replyWithChatAction("typing");
    ctx.replyWithPhoto(`https://cataas.com/cat/says/${encodeURI(ctx.message.text)}`, keyboard);
  });
  bot.action("answer", (ctx) => {
    ctx.reply("Напиши твой ответ:");
  });

  bot.launch().then(() => {
    console.log("bot started");
  });

  // Enable graceful stop
  process.once("SIGINT", () => bot.stop("SIGINT"));
  process.once("SIGTERM", () => bot.stop("SIGTERM"));
}
