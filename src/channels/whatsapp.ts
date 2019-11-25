import express, { Request, Response, Application } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import bodyParser from 'body-parser';
import twilio, { Twilio } from 'twilio';
import { MessageInstance } from 'twilio/lib/rest/api/v2010/account/message';
import { TwilioCredentials } from './whatsapp.interface';

// https://www.twilio.com/docs/sms/whatsapp/quickstart/node?code-sample=code-send-a-message-with-whatsapp-and-nodejs&code-language=Node.js&code-sdk-version=3.x
// https://www.twilio.com/console/sms/whatsapp/sandbox
// https://www.twilio.com/docs/sms/whatsapp/api

export const setupWhatsapp = (credentials: TwilioCredentials, app: Application = null,
  port: number = 3000, cb: Function): void => {
  let expressApplication = app;

  const { channel: twilioChannel, accountSid, authToken } = credentials;
  const client = twilio(accountSid, authToken);

  if (!expressApplication) {
    expressApplication = express();

    expressApplication.use(morgan('tiny'));

    expressApplication.use(cors());

    expressApplication.use(bodyParser.json());
    expressApplication.use(bodyParser.urlencoded({ extended: false }));

    const PORT = process.env.PORT || port;
    expressApplication.listen(PORT, () => console.log(`[✓] Running on port ${PORT}`));
  }

  expressApplication.post('/webhook/messages', MessageHandler(client, twilioChannel, cb));
};

const MessageHandler = (client: Twilio, twilioChannel: string, cb: Function) => (req: Request,
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
