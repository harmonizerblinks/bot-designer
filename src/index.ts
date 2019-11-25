import { createMutableState } from 'mutablestate.js';
import { Application } from 'express';
import { setupWhatsapp } from './channels/whatsapp';
import { setupTelegram } from './channels/telegram';
import { Route, MessageOptions } from './main/render.interface';
import { render } from './main/render';
import { History } from './main/history.interface';

export const Superbot = (routes: Route[], initialHistory: History[] = []) => {
  let historyCallback: Function = () => {};

  const historyState = createMutableState<History[]>(initialHistory);
  historyState.onChange((h: History[]): void => historyCallback(h));

  const messageCallback = (opts: MessageOptions): void => render(historyState, routes, opts)();

  return {
    setupWhatsapp: (channel: string, accountSid: string, authToken: string,
      app: Application = null, port?: number) => {
      setupWhatsapp({ channel, accountSid, authToken }, app, port, messageCallback);
    },
    setupTelegram: (token: string) => {
      setupTelegram({ token, allowPolling: true }, messageCallback);
    },
    onHistory: (cb: Function): void => {
      historyCallback = cb;
    },
  };
};

// TODO: /command => remove
// TODO: middleware => pass in props
