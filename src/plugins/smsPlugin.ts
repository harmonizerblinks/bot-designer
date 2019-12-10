import { Application, Request, Response } from 'express';
import africastalking from 'africastalking';
import { MessageCallback } from '../main/render.interface';
import { shortenUrl } from '../utils/misc';

const sendMedia = (sms: any, shortcode: string, from: string) => async (
  url: string, caption: string = ' ',
) => {
  const shortUrl = await shortenUrl(url);
  return sms.send({
    from: shortcode,
    message: `${shortUrl}\n${caption}`,
    to: [from],
  });
};

const MessageHandler = (sms: any, shortcode: string, cb: MessageCallback) => (
  req: Request, res: Response,
): void => {
  res.json({ ok: true });

  const { from, text: rawText } = req.body;
  const formattedText = rawText.trim() || 'start';

  cb({
    from,
    text: formattedText,
    channel: 'SMS',
    onSendMessage: (text) => sms.send({
      from: shortcode,
      message: text,
      to: [from],
    }),
    onSendPhoto: sendMedia(sms, shortcode, from),
    onSendAudio: sendMedia(sms, shortcode, from),
    onSendVideo: sendMedia(sms, shortcode, from),
    onSendDocument: sendMedia(sms, shortcode, from),
    onSendContact: (phoneNumber, firstName, lastName) => sms.send({
      from: shortcode,
      message: `${firstName} ${lastName}\n${phoneNumber}`,
      to: [from],
    }),
    onSendLocation: (latitude, longitude) => sendMedia(sms, shortcode, from)(
      `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`,
    ),
  });
};

export const smsPlugin = (apiKey: string, username: string, shortcode: string) => (app: Application,
  cb: MessageCallback): void => {
  const { SMS: sms } = africastalking({ apiKey, username });

  app.post('/webhook/sms', MessageHandler(sms, shortcode, cb));
};
