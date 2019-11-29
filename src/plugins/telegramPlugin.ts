import { Application } from 'express';
import TelegramBot, { Message } from 'node-telegram-bot-api';
import { MessageCallback } from '../main/render.interface';

export const telegramPlugin = (token: string) => (_app: Application, cb: MessageCallback): void => {
  const bot = new TelegramBot(token, { polling: true });

  bot.on('message', (msg: Message): void => {
    const { text: rawText, chat: { id: chatId } } = msg;
    const formattedText = (rawText && rawText.trim()) || 'start';

    cb({
      from: chatId,
      text: formattedText,
      channel: 'TELEGRAM',
      onSendMessage: (text, opts): Promise<Message> => bot.sendMessage(chatId,
        text, (opts && opts.telegram) || { parse_mode: 'Markdown' }),
      onSendPhoto: (photo, opts) => bot.sendPhoto(chatId, photo, opts),
    });
  });
};
