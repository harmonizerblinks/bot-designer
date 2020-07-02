import { Application, Request, Response } from 'express';
import { Client } from 'africastalking-ts';
import AFRICASTALKING from 'africastalking-ts/dist/products/index.types';
import { MessageCallback } from '../main/render.types';

const sendMedia = (client: AFRICASTALKING, shortcode: string, from: string) => async (
  url: string, caption: string = ' ',
) => client.sendSms({
  from: shortcode,
  message: `${url}\n${caption}`,
  to: [from],
});

const MessageHandler = (client: AFRICASTALKING, shortcode: string, cb: MessageCallback) => (
  req: Request, res: Response,
): void => {
  res.json({ ok: true });

  const { from, text: rawText } = req.body;
  const formattedText = rawText.trim() || 'start';

  cb({
    from,
    text: formattedText,
    channel: 'SMS',
    onSendMessage: (text) => client.sendSms({
      from: shortcode,
      message: text,
      to: [from],
    }),
    onSendPhoto: sendMedia(client, shortcode, from),
    onSendAudio: sendMedia(client, shortcode, from),
    onSendVideo: sendMedia(client, shortcode, from),
    onSendDocument: sendMedia(client, shortcode, from),
    onSendContact: (phoneNumber, firstName, lastName) => client.sendSms({
      from: shortcode,
      message: `${firstName} ${lastName}\n${phoneNumber}`,
      to: [from],
    }),
    onSendLocation: (latitude, longitude) => sendMedia(client, shortcode, from)(
      `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`,
    ),
  });
};

export const atSmsPlugin = (apiKey: string, username: string, shortcode: string) => (
  app: Application, cb: MessageCallback,
): void => {
  const client = new Client({ apiKey, username });

  app.post('/webhook/africastalking/sms', MessageHandler(client, shortcode, cb));
};
