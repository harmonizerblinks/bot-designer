import { Application } from 'express';
import { SendMessageOptions } from 'node-telegram-bot-api';
import { CustomObject } from '../utils/misc.interface';

export type Render = (text?: string, props?: CustomObject) => void;

export interface Route {
  path: string;
  aliases?: string[];
  middleware?: Middleware[];
  component: Component;
}

export type Middleware = (props: CustomObject, next: (props?: CustomObject) => void) => void;
export type Component = (props: DefaultProps) => void;

export interface HistoryLifecyle {
  getLockStatus(): boolean;
  lock(): void;
  unlock(): void;
  getState(): CustomObject;
  setState(state: CustomObject): void;
}

export interface MessageOptions {
  from: string | number;
  text: string;
  channel: 'WHATSAPP' | 'TELEGRAM' | 'USSD';
  onSendMessage: (text: string, opts?: Opts) => Promise<any>;
}

interface Opts {
  telegram?: SendMessageOptions;
  ussd?: {
    type: 'CON' | 'END';
  };
}

export interface DefaultProps extends MessageOptions {
  render: Render;
  history: HistoryLifecyle;
}

export type MessageCallback = (opts: MessageOptions) => void;
export type Plugin = (app: Application, cb: MessageCallback) => void;
