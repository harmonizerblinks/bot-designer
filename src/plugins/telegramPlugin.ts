import { Application } from 'express';
import TelegramBot, { Message, SendMessageOptions } from 'node-telegram-bot-api';

export const telegramPlugin = (token: string) => (app: Application, cb: Function): void => {
  const bot = new TelegramBot(token, { polling: true });

  bot.on('message', (msg: Message): void => {
    const { text: rawText, from: { id: chatId } } = msg;
    const text = rawText ? rawText.trim() : '';

    cb({
      from: chatId,
      text,
      channel: 'TELEGRAM',
      onSendMessage: (text: string, opts: SendMessageOptions): Promise<Message> => sendMessage(
        bot, chatId, text, opts,
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
    throw err;
  }
};

// import axios from 'axios';

// const BASE_URL = 'https://api.telegram.org/bot';
// const token = '';
// const url = `${BASE_URL}${token}/method`;
