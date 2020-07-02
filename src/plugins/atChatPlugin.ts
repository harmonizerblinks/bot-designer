import { Request, Response, Application } from 'express';
import { Client } from 'africastalking-ts';
import AFRICASTALKING from 'africastalking-ts/dist/products/index.types';
import { MessageCallback } from '../main/render.types';

interface ChatOptions {
  productId : string;
  whatsapp: {
    channelNumber: string;
  };
  telegram: {
    channelNumber: string;
  };
}

const MessageHandler = (client: AFRICASTALKING, options: ChatOptions, cb: MessageCallback) => (
  req: Request, res: Response,
): void => {
  res.json({ ok: true });

  if (!req.body.entry || req.body.entry.status) return;

  const { entry: { channel, customerNumber: to, text: rawText } } = req.body;
  const formattedText = rawText?.trim() || 'start';

  const { productId } = options;
  const from = (options as any)[channel.toLowerCase()].channelNumber;

  const sendMedia = (type: any, url: string, caption?: string) => client.sendChatMediaMessage({
    productId,
    channel,
    from,
    to,
    type,
    url,
    caption,
  });

  cb({
    from,
    text: formattedText,
    channel,
    onSendMessage: (text) => client.sendChatTextMessage({
      productId,
      channel,
      from,
      to,
      message: text,
    }),
    onSendPhoto: (url, caption) => sendMedia('image', url, caption),
    onSendAudio: (url, caption) => sendMedia('audio', url, caption),
    onSendVideo: (url, caption) => sendMedia('video', url, caption),
    onSendDocument: (url, caption) => sendMedia('document', url, caption),
    onSendLocation: (lat, lng) => client.sendChatLocationMessage({
      productId,
      channel,
      from,
      to,
      lat,
      lng,
    }),
  });
};

export const atChatPlugin = (apiKey: string, username: string, chatOptions: ChatOptions) => (
  app: Application, cb: MessageCallback,
): void => {
  const client = new Client({ apiKey, username });

  app.post('/webhook/africastalking/chat', MessageHandler(client, chatOptions, cb));
};
