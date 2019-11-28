import { Request, Response, Application } from 'express';
import { ussdRouter } from 'ussd-router';
import { MessageCallback } from '../main/render.interface';

const MessageHandler = (cb: MessageCallback) => (req: Request,
  res: Response): void => {
  const { phoneNumber: from, text: rawText } = req.body;
  const formattedText = ussdRouter(rawText.trim(), '0', '00') || 'start';

  cb({
    from,
    text: formattedText,
    channel: 'USSD',
    onSendMessage: (text, opts) => {
      const sendingOptions = (opts && opts.ussd) || { type: 'CON' };
      let msg = sendingOptions.type === 'CON'
        ? `CON ${text}`
        : `END ${text}`;

      if (formattedText !== 'start' && sendingOptions.type !== 'END') {
        msg += '\n\n00: Back';
        msg += '\n0: Home';
      }

      res.send(msg);
      return Promise.resolve();
    },
  });
};

export const ussdPlugin = () => (app: Application, cb: MessageCallback): void => {
  app.post('/webhook/ussd', MessageHandler(cb));
};
