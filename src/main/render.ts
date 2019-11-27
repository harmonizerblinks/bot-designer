import { MutableState } from 'mutablestate.js/dist/interface';
import { CustomObject } from '../utils/misc.interface';
import {
  Route, HistoryLifecyle, Render, MessageOptions, DefaultProps, Middleware,
} from './render.interface';
import { History } from './history.interface';
import { getUserHistory, createUserHistory, updateUserHistory } from './history';
import { guesstimateRoute, isCommand } from './utils';

export const render = (historyState: MutableState<History[]>, routes: Route[],
  primaryProps: MessageOptions): Render => (text = primaryProps.text, secondaryProps = {}) => {
  const { from } = primaryProps;

  const userHistory: History = createHistoryForUserIfDoesNotExist(historyState, from);
  const route: Route = getRoute(historyState, routes, userHistory, from, text);

  const props: DefaultProps = {
    ...primaryProps,
    ...secondaryProps,
    render: render(historyState, routes, primaryProps),
    history: createHistoryLifecycle(historyState, userHistory, from),
  };

  let updatedProps: CustomObject = props;

  if (route && route.component && typeof route.component === 'function') {
    if (route.middleware) {
      (async () => {
        try {
          const middleware: Middleware[] = route.middleware as any;

          for (let i = 0; i < middleware.length; i += 1) {
            const m = middleware[i];

            if (typeof m !== 'function') {
              return Promise.resolve();
            }

            let shouldContinue: boolean = false;

            await m(updatedProps, (moreProps?: CustomObject): void => {
              updatedProps = { ...updatedProps, ...(moreProps || {}) };
              shouldContinue = true;

              if (i + 1 === middleware.length) {
                route.component(updatedProps as any);
              }
            });

            if (!shouldContinue) {
              break;
            }
          }
        } catch (err) {
          throw err;
        }
      })();
    } else {
      route.component(props);
    }
  } else {
    throw new Error('Invalid route: Missing component');
  }
};

const createHistoryForUserIfDoesNotExist = (historyState: MutableState<History[]>,
  entityRef: string) => {
  let userHistory: History = getUserHistory(historyState.get(), entityRef) as History;

  if (!userHistory) {
    const newHistory = createUserHistory(historyState.get(), entityRef);
    historyState.set(newHistory);

    userHistory = getUserHistory(historyState.get(), entityRef) as History;
  }

  return userHistory;
};

const getRoute = (historyState: MutableState<History[]>, routes: Route[], userHistory: History,
  entityRef: string, text: string): Route => {
  let route: Route;
  let newHistory: History[];

  if (isCommand(text) || !userHistory.locked) {
    route = guesstimateRoute(routes, text);
    newHistory = updateUserHistory(historyState.get(), entityRef, {
      path: route.path,
      locked: false,
      state: {},
    });
  } else {
    route = guesstimateRoute(routes, userHistory.path);
    newHistory = updateUserHistory(historyState.get(), entityRef, {
      path: route.path,
      locked: true,
      state: userHistory.state,
    });
  }

  historyState.set(newHistory);

  return route;
};

const createHistoryLifecycle = (historyState: MutableState<History[]>, userHistory: History,
  entityRef: string): HistoryLifecyle => ({
  getLockStatus: () => userHistory.locked,
  lock: (): void => {
    const newHistory = updateUserHistory(historyState.get(), entityRef, { locked: true });
    historyState.set(newHistory);
  },
  unlock: (): void => {
    const newHistory = updateUserHistory(historyState.get(), entityRef, { locked: false });
    historyState.set(newHistory);
  },
  getState: () => userHistory.state,
  setState: (state: CustomObject): void => {
    const newHistory = updateUserHistory(historyState.get(), entityRef, { state });
    historyState.set(newHistory);
  },
});
