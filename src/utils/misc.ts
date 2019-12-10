import path from 'path';
import { BitlyClient } from 'bitly';

export const isEmptyObject = (obj: any): boolean => Object.entries(obj).length === 0
  && obj.constructor === Object;

export const getRootPath = () => path.join(__dirname, '').split('/src')[0];

export const shortenUrl = async (longUrl: string): Promise<string> => {
  const bitly = new BitlyClient('93bb9f3bf876734e2fa959d7bbedff489cd665d8', {});
  const { url } = await bitly.shorten(longUrl) as any;
  return url;
};
