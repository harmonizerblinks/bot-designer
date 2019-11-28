import { MutableState } from 'mutablestate.js/dist/interface';
import { CustomObject } from '../utils/misc.interface';
import {
  Route, HistoryLifecyle, Render, MessageOptions, DefaultProps, Middleware,
} from './render.interface';
import { History } from './history.interface';
import { getUserHistory, createUserHistory, updateUserHistory } from './history';
import { guesstimateRoute, isCommand } from './utils';

const createHistoryForUserIfDoesNotExist = (historyState: MutableState<History[]>,
  entityRef: string | number) => {
  let userHistory: History = getUserHistory(historyState.get(), entityRef) as History;

  if (!userHistory) {
    const newHistory = createUserHistory(historyState.get(), entityRef);
    historyState.set(newHistory);

    userHistory = getUserHistory(historyState.get(), entityRef) as History;
  }

  return userHistory;
};

const getRoute = (historyState: MutableState<History[]>, routes: Route[], userHistory: History,
  entityRef: string | number, text: string): Route | undefined => {
  let route: Route;
  let newHistory: History[];

  if (isCommand(text) || !userHistory.locked) {
    route = guesstimateRoute(routes, text) as Route;
    if (!route) {
      return undefined;
    }
    newHistory = updateUserHistory(historyState.get(), entityRef, {
      path: route.path,
      locked: false,
      state: {},
    });
  } else {
    route = guesstimateRoute(routes, userHistory.path) as Route;
    if (!route) {
      return undefined;
    }
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
  entityRef: string | number): HistoryLifecyle => ({
  getLockStatus: () => (getUserHistory(historyState.get(), entityRef) as History).locked,
  lock: (): void => {
    const newHistory = updateUserHistory(historyState.get(), entityRef, { locked: true });
    historyState.set(newHistory);
  },
  unlock: (): void => {
    const newHistory = updateUserHistory(historyState.get(), entityRef, { locked: false });
    historyState.set(newHistory);
  },
  getState: () => (getUserHistory(historyState.get(), entityRef) as History).state,
  setState: (state: CustomObject): void => {
    const newHistory = updateUserHistory(historyState.get(), entityRef, { state });
    historyState.set(newHistory);
  },
});

export const render = (historyState: MutableState<History[]>, routes: Route[],
  primaryProps: MessageOptions): Render => (text = primaryProps.text, secondaryProps = {}) => {
  const { from } = primaryProps;

  const userHistory: History = createHistoryForUserIfDoesNotExist(historyState, from);
  const route: Route | undefined = getRoute(historyState, routes, userHistory, from, text);

  if (!route) {
    throw new Error('Invalid route: Missing component');
  }

  const props: DefaultProps = {
    ...primaryProps,
    ...secondaryProps,
    render: render(historyState, routes, primaryProps),
    history: createHistoryLifecycle(historyState, userHistory, from),
  };

  let updatedProps: CustomObject = props;

  if (route && route.component && typeof route.component === 'function') {
    // eslint-disable-next-line consistent-return
    (async (): Promise<void> => {
      if (route.middleware) {
        const middleware: Middleware[] = route.middleware as any;

        for (let i = 0; i < middleware.length; i += 1) {
          const m = middleware[i];

          if (typeof m !== 'function') {
            return Promise.resolve();
          }

          let shouldContinue: boolean = false;

          // eslint-disable-next-line no-await-in-loop, no-loop-func
          await m(updatedProps, (moreProps?: CustomObject): void => {
            updatedProps = { ...updatedProps, ...(moreProps || {}) };
            shouldContinue = true;
          });

          if (!shouldContinue) {
            break;
          }
        }
      }
    })();

    route.component(updatedProps as any);
  } else {
    throw new Error('Invalid route: Missing component');
  }
};
