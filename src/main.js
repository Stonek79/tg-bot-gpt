import { Telegraf, session } from "telegraf";
import { message } from "telegraf/filters";
import { code } from "telegraf/format";
import config from "config";
import { create, toMp3 } from "./oggConverter.js";
import { chat, roles, transcription } from "./openai.js";

const INITIAL_SESSION = {
  messages: [],
};

const bot = new Telegraf(config.get("TELEGRAM_GPT_TOKEN"));

bot.use(session());

bot.command("new", async (ctx) => {
  ctx.session = INITIAL_SESSION;
  await ctx.reply("Жду ваших приказаний, господин!");
});

bot.command("start", async (ctx) => {
  ctx.session = INITIAL_SESSION;
  await ctx.reply("Жду ваших приказаний, господин!");
});

bot.on(message("voice"), async (ctx) => {
  ctx.session ??= INITIAL_SESSION;

  try {
    await ctx.reply(code("Принял сообщение! Работаю, ожидайте..."));
    const userId = await String(ctx.message.from.id);
    const fileLink = await ctx.telegram.getFileLink(ctx.message.voice.file_id);

    const oggPath = await create(fileLink.href, userId);
    const mp3Path = await toMp3(oggPath, userId);

    const text = await transcription(mp3Path);
    await ctx.reply(code(`Обрабатываю запрос: ${text}`));

    ctx.session.messages.push({ role: roles.USER, content: text });

    const response = await chat(ctx.session.messages);

    ctx.session.messages.push({
      role: roles.ASSISTANT,
      content: response.content,
    });

    await ctx.reply(response.content);
  } catch (error) {
    console.log("Error when try voice message ", error.message);
  }
});

bot.on(message("text"), async (ctx) => {
  ctx.session ??= INITIAL_SESSION;

  try {
    await ctx.reply(code("Принял сообщение! Работаю, ожидайте..."));

    ctx.session.messages.push({ role: roles.USER, content: ctx.message.text });

    const response = await chat(ctx.session.messages);

    ctx.session.messages.push({
      role: roles.ASSISTANT,
      content: response.content,
    });

    await ctx.reply(response.content);
  } catch (error) {
    console.log("Error when try voice message ", error.message);
  }
});

bot.launch();

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
