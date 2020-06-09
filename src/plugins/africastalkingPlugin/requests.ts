import axios from 'axios';
import { RequestOptions } from './requests.types';
import { Credentials, Channel } from './index.types';

const sendRequest = (options: RequestOptions) => {
  const {
    credentials: { apiKey, username, ...rest },
    endpoint,
    channel,
    to,
    data,
  } = options;

  return axios.post(
    `https://chat.africastalking.com/message/${endpoint}`,
    {
      username,
      channelNumber: (rest as any)[channel.toLowerCase()].channelNumber,
      channel,
      customerNumber: to,
      ...data,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        accept: 'application/json',
        apiKey,
      },
    },
  );
};

export const Chat = (credentials: Credentials) => {
  const { productId } = credentials;

  return {
    sendOptIn: (channel: Channel, to: string) => sendRequest({
      credentials,
      endpoint: 'consent',
      channel,
      to,
      data: {
        action: 'OptIn',
      },
    }),
    sendTemplate: (channel: Channel, to: string) => sendRequest({
      credentials,
      endpoint: 'send',
      channel,
      to,
      data: {
        productId,
        template: {
          name: 'at_messaging2020',
          params: ['sam', 'gikandi.api', '5', '10'],
        },
      },
    }),
    sendMessage: (channel: Channel, to: string, text: string) => sendRequest({
      credentials,
      endpoint: 'send',
      channel,
      to,
      data: {
        productId,
        body: {
          type: 'Text',
          text,
        },
      },
    }),
    sendMedia: (
      channel: Channel,
      to: string,
      type: 'Image' | 'Audio' | 'Video' | 'Document' | 'Voice' | 'Sticker',
      url: string,
    ) => {
      const types = ['Image', 'Audio', 'Video', 'Document', 'Voice', 'Sticker'];

      if (!types.includes(type)) throw new Error(`Invalid media type. Valid: ${types.join(', ')}`);

      return sendRequest({
        credentials,
        endpoint: 'send',
        channel,
        to,
        data: {
          productId,
          body: {
            type: 'Media',
            media: type,
            url,
          },
        },
      });
    },
    sendLocation: (
      channel: Channel, to: string, latitude: number, longitude: number,
    ) => sendRequest({
      credentials,
      endpoint: 'send',
      channel,
      to,
      data: {
        productId,
        body: {
          type: 'Location',
          latitude,
          longitude,
        },
      },
    }),
  };
};
