import { Request, Response, Application } from 'express';
import { ussdRouter } from 'ussd-router';
import { MessageCallback } from '../main/render.interface';

const MessageHandler = (cb: MessageCallback) => (req: Request,
  res: Response): void => {
  const { phoneNumber: from, text: rawText } = req.body;

  const preFormattedText = ussdRouter(rawText.trim(), '00', '0') || 'start';
  const [formattedText] = preFormattedText.split('*').slice(-1);

  const footer = '\n\n0: Back\n00: Home';

  cb({
    from,
    text: formattedText,
    channel: 'USSD',
    onSendMessage: (text, opts) => {
      const sendingOptions = (opts && opts.ussd) || { type: 'CON', showFooter: false };
      let msg = sendingOptions.type === 'CON'
        ? `CON ${text}`
        : `END ${text}`;

      if (sendingOptions.showFooter || (formattedText !== 'start' && sendingOptions.type !== 'END')) {
        msg += footer;
      }

      res.send(msg);
      return Promise.resolve();
    },
  });
};

export const ussdPlugin = () => (app: Application,
  cb: MessageCallback): void => {
  app.post('/webhook/ussd', MessageHandler(cb));
};
