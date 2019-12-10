import { Request, Response, Application } from 'express';
import twilio, { Twilio } from 'twilio';
import { MessageCallback } from '../main/render.interface';

// https://www.twilio.com/docs/sms/whatsapp/quickstart/node?code-sample=code-send-a-message-with-whatsapp-and-nodejs&code-language=Node.js&code-sdk-version=3.x
// https://www.twilio.com/console/sms/whatsapp/sandbox
// https://www.twilio.com/docs/sms/whatsapp/api

const sendMedia = (client: Twilio, twilioChannel: string, from: string) => async (
  url: string, caption: string = ' ',
) => client.messages.create({
  from: twilioChannel,
  body: caption,
  to: `whatsapp:${from}`,
  mediaUrl: url,
});

const MessageHandler = (client: Twilio, twilioChannel: string, cb: MessageCallback) => (
  req: Request, res: Response,
): void => {
  res.json({ ok: true });

  const { Body: rawText, From: sender } = req.body;
  const formattedText = rawText.trim() || 'start';
  const from = sender && sender.split('whatsapp:')[1];

  cb({
    from,
    text: formattedText,
    channel: 'WHATSAPP',
    onSendMessage: (text) => client.messages.create({
      from: twilioChannel,
      body: text,
      to: `whatsapp:${from}`,
    }),
    onSendPhoto: sendMedia(client, twilioChannel, from),
    onSendAudio: sendMedia(client, twilioChannel, from),
    onSendVideo: sendMedia(client, twilioChannel, from),
    onSendDocument: sendMedia(client, twilioChannel, from),
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
