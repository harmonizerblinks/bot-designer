import { Request, Response, Application } from 'express';
import twilio, { Twilio } from 'twilio';
import { MessageInstance } from 'twilio/lib/rest/api/v2010/account/message';
import { MessageCallback } from '../main/render.interface';

// https://www.twilio.com/docs/sms/whatsapp/quickstart/node?code-sample=code-send-a-message-with-whatsapp-and-nodejs&code-language=Node.js&code-sdk-version=3.x
// https://www.twilio.com/console/sms/whatsapp/sandbox
// https://www.twilio.com/docs/sms/whatsapp/api

const MessageHandler = (client: Twilio, twilioChannel: string, cb: MessageCallback) => (
  req: Request, res: Response,
): void => {
  res.json({ ok: true });

  const { Body: rawText, From: sender } = req.body;
  const formattedText = rawText.trim() || 'start';
  const from = sender && sender.split('whatsapp:')[1];

  const sendMedia = async (url: string, caption?: string) => client.messages.create({
    from: twilioChannel,
    body: caption,
    to: `whatsapp:${from}`,
    mediaUrl: url,
  });

  cb({
    from,
    text: formattedText,
    channel: 'WHATSAPP',
    onSendMessage: async (text: string): Promise<MessageInstance> => client.messages.create({
      from: twilioChannel,
      body: text,
      to: `whatsapp:${from}`,
    }),
    onSendPhoto: sendMedia,
    onSendAudio: sendMedia,
    onSendVideo: sendMedia,
    onSendDocument: sendMedia,
    onSendContact: (phoneNumber, firstName, lastName) => client.messages.create({
      from: twilioChannel,
      body: `*${firstName}${lastName ? (` ${lastName}`) : ''}*\n${phoneNumber}`,
      to: `whatsapp:${from}`,
    }),
    onSendLocation: (latitude, longitude) => client.messages.create({
      from: twilioChannel,
      to: `whatsapp:${from}`,
      body: ' ',
      persistentAction: [
        `geo:${latitude},${longitude}`,
      ],
    }),
  });
};

export const whatsappPlugin = (twilioChannel: string, accountSid: string,
  authToken: string) => (app: Application, cb: MessageCallback): void => {
  const client = twilio(accountSid, authToken);

  app.post('/webhook/whatsapp', MessageHandler(client, twilioChannel, cb));
};
