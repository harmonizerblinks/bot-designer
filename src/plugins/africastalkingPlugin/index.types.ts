export interface Credentials {
  apiKey: string;
  username: string;
  productId : string;
  whatsapp: {
    channelNumber: string;
  };
  telegram: {
    channelNumber: string;
  };
}

export type Channel = 'WhatsApp';
