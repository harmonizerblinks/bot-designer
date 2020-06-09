import { MutableState } from 'mutablestate.js/dist/interface';
import { FreeFormObject } from '../utils/misc.types';
import {
  Route, Render, MessageOptions, DefaultProps, Middleware, Channel,
} from './render.types';
import { History } from '../history/history.types';
import { getUserHistory, createUserHistory, updateUserHistory } from '../history/history';
import { guesstimateRoute, isCommand, getTimeDiffInMins } from './utils';
import { historyController } from '../history/historyController';

const createHistoryForUserIfDoesNotExist = (historyState: MutableState<History[]>,
  entityRef: string | number, channel: Channel): History => {
  let userHistory: History = getUserHistory(historyState.get(), entityRef, channel) as History;

  if (!userHistory) {
    const newHistory = createUserHistory(historyState.get(), entityRef, channel);
    historyState.set(newHistory);

    userHistory = getUserHistory(historyState.get(), entityRef, channel) as History;
  }

  if (getTimeDiffInMins(userHistory.updatedAt) > 15) {
    const newHistory = updateUserHistory(historyState.get(), entityRef, {
      path: '',
      locked: false,
      state: {},
    });

    historyState.set(newHistory);
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

export const render = (historyState: MutableState<History[]>, routes: Route[],
  primaryProps: MessageOptions): Render => (text = primaryProps.text, secondaryProps = {}) => {
  const { from } = primaryProps;

  const userHistory: History = createHistoryForUserIfDoesNotExist(historyState,
    from, primaryProps.channel);
  const route: Route | undefined = getRoute(historyState, routes, userHistory, from, text);

  if (!route || !route.component || typeof route.component !== 'function') {
    throw new Error('Invalid route: Missing component');
  }

  const props: DefaultProps = {
    ...primaryProps,
    ...secondaryProps,
    render: render(historyState, routes, primaryProps),
    history: historyController(historyState, from, primaryProps.channel,
      text, primaryProps.onSendMessage),
  };

  let updatedProps: FreeFormObject = props;

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
        await m(updatedProps, (moreProps?: FreeFormObject): void => {
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
};
