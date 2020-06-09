import { createMutableState } from 'mutablestate.js';
import { Application } from 'express';
import { Route, MessageCallback, Plugin } from './render.types';
import { render } from './render';
import { History } from '../history/history.types';
import { startServer } from '../utils/startServer';

export const BotDesigner = (expressApplication?: Application) => {
  const app = expressApplication || startServer();

  const historyState = createMutableState<History[]>([]);
  const routesState = createMutableState<Route[]>([]);

  let historyCB: Function = () => {};
  historyState.onChange((h: History[]): void => historyCB(h));

  return {
    setRoutes: (routes: Route[]): void => {
      routesState.set(routes);
    },
    setHistory: (history: History[]): void => {
      historyState.set(history);
    },
    onHistory: (cb: Function): void => {
      historyCB = cb;
    },
    use: (plugin: Plugin): void => {
      const messageCallback: MessageCallback = (opts) => render(
        historyState, routesState.get(), opts,
      )();
      plugin(app, messageCallback);
    },
  };
};
