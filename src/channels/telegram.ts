import TelegramBot, { Message, SendMessageOptions } from 'node-telegram-bot-api';
import { TelegramCredentials } from './telegram.interface';

export const setupTelegram = (credentials: TelegramCredentials, cb: Function) => {
  const { token, allowPolling } = credentials;
  const bot = new TelegramBot(token, { polling: allowPolling });

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
