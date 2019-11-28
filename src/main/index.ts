import { createMutableState } from 'mutablestate.js';
import { Application } from 'express';
import { Route, MessageCallback, Plugin } from './render.interface';
import { render } from './render';
import { History } from './history.interface';
import { startExpressServer } from '../utils/startExpressServer';

export const Superbot = (expressApplication?: Application) => {
  const app = expressApplication || startExpressServer();

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
