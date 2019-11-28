import { Application } from 'express';
import TelegramBot, { Message, SendMessageOptions } from 'node-telegram-bot-api';
import { MessageCallback } from '../main/render.interface';

const sendMessage = async (bot: TelegramBot, chatId: string | number, text: string,
  opts: SendMessageOptions = { parse_mode: 'Markdown' },
): Promise<Message> => bot.sendMessage(chatId, text, opts);

export const telegramPlugin = (token: string) => (_app: Application, cb: MessageCallback): void => {
  const bot = new TelegramBot(token, { polling: true });

  bot.on('message', (msg: Message): void => {
    const { text: rawText, chat: { id: chatId } } = msg;
    const formattedText = (rawText && rawText.trim()) || 'start';

    cb({
      from: chatId,
      text: formattedText,
      channel: 'TELEGRAM',
      onSendMessage: (text, opts): Promise<Message> => sendMessage(
        bot, chatId, text, (opts && opts.telegram),
      ),
    });
  });
};

// import axios from 'axios';

// const BASE_URL = 'https://api.telegram.org/bot';
// const token = '';
// const url = `${BASE_URL}${token}/method`;
