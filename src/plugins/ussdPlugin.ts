import { Request, Response, Application } from 'express';
import { ussdRouter } from 'ussd-router';
import { MessageCallback } from '../main/render.interface';

export const ussdPlugin = () => (app: Application, cb: MessageCallback): void => {
  app.post('/webhook/ussd', MessageHandler(cb));
};

const MessageHandler = (cb: MessageCallback) => (req: Request,
  res: Response): void => {
  const { phoneNumber: from, text: rawText } = req.body;
  const text = ussdRouter(rawText.trim(), '0', '00') || 'start';

  cb({
    from,
    text,
    channel: 'USSD',
    onSendMessage: (msg, opts) => {
      const sendingOptions = (opts && opts.ussd) || { type: 'CON' };
      let formattedMsg = sendingOptions.type === 'CON'
        ? `CON ${msg}`
        : `END ${msg}`;

      if (text !== 'start' && sendingOptions.type !== 'END') {
        formattedMsg += '\n\n00: Back';
        formattedMsg += '\n0: Home';
      }

      res.send(formattedMsg);
      return Promise.resolve();
    },
  });
};
