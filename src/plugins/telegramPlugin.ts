import { Application } from 'express';
import TelegramBot, { Message, SendMessageOptions } from 'node-telegram-bot-api';
import { MessageCallback } from '../main/render.interface';

export const telegramPlugin = (token: string) => (_app: Application, cb: MessageCallback): void => {
  const bot = new TelegramBot(token, { polling: true });

  bot.on('message', (msg: Message): void => {
    const { text: rawText, from: { id: chatId } } = msg;
    const text = rawText ? rawText.trim() : '';

    cb({
      from: chatId,
      text,
      channel: 'TELEGRAM',
      onSendMessage: (text, opts): Promise<Message> => sendMessage(
        bot, chatId, text, (opts && opts.telegram),
      ),
    });
  });
};

const sendMessage = async (bot: TelegramBot, chatId: string | number, text: string,
  opts: SendMessageOptions = { parse_mode: 'Markdown' }): Promise<Message> => {
  try {
    const msg = await bot.sendMessage(chatId, text, opts);
    return Promise.resolve(msg);
  } catch (err) {
    console.log(err);
    throw err;
  }
};

// import axios from 'axios';

// const BASE_URL = 'https://api.telegram.org/bot';
// const token = '';
// const url = `${BASE_URL}${token}/method`;
