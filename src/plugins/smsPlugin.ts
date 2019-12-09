import { Application, Request, Response } from 'express';
import africastalking from 'africastalking';
import { MessageCallback } from '../main/render.interface';

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
    onSendMessage: async (text: string): Promise<any> => sms.send({
      from: shortcode,
      message: text,
      to: [from],
    }),
    onSendPhoto: async (photoUrl, caption) => sms.send({
      from: shortcode,
      message: `${photoUrl}\n\n${caption}`,
      to: [from],
    }),
  });
};

export const smsPlugin = (apiKey: string, username: string, shortcode: string) => (app: Application,
  cb: MessageCallback): void => {
  const { SMS: sms } = africastalking({ apiKey, username });

  app.post('/webhook/sms', MessageHandler(sms, shortcode, cb));
};
