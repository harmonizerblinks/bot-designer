import { Request, Response, Application } from 'express';
import twilio, { Twilio } from 'twilio';
import { MessageInstance } from 'twilio/lib/rest/api/v2010/account/message';
import { MessageCallback } from '../main/render.interface';

// https://www.twilio.com/docs/sms/whatsapp/quickstart/node?code-sample=code-send-a-message-with-whatsapp-and-nodejs&code-language=Node.js&code-sdk-version=3.x
// https://www.twilio.com/console/sms/whatsapp/sandbox
// https://www.twilio.com/docs/sms/whatsapp/api

export const whatsappPlugin = (twilioChannel: string, accountSid: string,
  authToken: string) => (app: Application, cb: MessageCallback): void => {
  const client = twilio(accountSid, authToken);

  app.post('/webhook/whatsapp', MessageHandler(client, twilioChannel, cb));
};

const MessageHandler = (client: Twilio, twilioChannel: string, cb: MessageCallback) => (req: Request,
  res: Response): void => {
  res.json({ ok: true });

  const { Body: rawText, From: sender } = req.body;

  const text = rawText ? rawText.trim() : '';
  const from = sender && sender.split('whatsapp:')[1];

  cb({
    from,
    text,
    channel: 'WHATSAPP',
    onSendMessage: (text: string): Promise<MessageInstance> => sendMessage(client,
      twilioChannel, from, text),
  });
};

const sendMessage = async (client: Twilio, twilioChannel: string,
  from: string, text: string): Promise<MessageInstance> => {
  try {
    const msg = await client.messages.create({
      from: twilioChannel,
      body: text,
      to: `whatsapp:${from}`,
    });

    return Promise.resolve(msg);
  } catch (err) {
    throw err;
  }
};
