import { CustomObject } from '../utils/misc.interface';

export type Render = (text?: string, props?: CustomObject) => void;

export interface Route {
  path: string;
  aliases?: string[];
  middleware?: Middleware[];
  component(props: DefaultProps): void;
}

export type Middleware = (props: CustomObject, next: (props?: CustomObject) => void) => void;

export interface HistoryLifecyle {
  getLockStatus(): boolean;
  lock(): void;
  unlock(): void;
  getState(): CustomObject;
  setState(state: CustomObject): void;
}

export interface MessageOptions {
  from: string;
  text: string;
  channel: 'WHATSAPP' | 'TELEGRAM';
  onSendMessage: (text: string, opts?: CustomObject) => Promise<any>;
}

export interface DefaultProps extends MessageOptions {
  render: Render;
  history: HistoryLifecyle;
}
