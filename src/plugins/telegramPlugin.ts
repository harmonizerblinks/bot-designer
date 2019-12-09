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
      onSendPhoto: (photoUrl, caption) => bot.sendPhoto(chatId, photoUrl, { caption }),
      onSendAudio: (audioUrl, caption) => bot.sendAudio(chatId, audioUrl, { caption }),
      onSendVideo: (videoUrl, caption) => bot.sendVideo(chatId, videoUrl, { caption }),
      onSendDocument: (documentUrl, caption) => bot.sendDocument(chatId, documentUrl, { caption }),
      onSendContact: (phoneNumber, firstName, lastName) => bot.sendContact(chatId, phoneNumber,
        firstName, {
          last_name: lastName,
        }),
      onSendLocation: (latitude, longitude) => bot.sendLocation(chatId, latitude, longitude),
    });
  });
};
