import { MutableState } from 'mutablestate.js/dist/interface';
import { CustomObject } from '../utils/misc.interface';
import {
  Route, HistoryLifecyle, Render, MessageOptions, DefaultProps,
} from './render.interface';
import { History } from './history.interface';
import { getUserHistory, createUserHistory, updateUserHistory } from './history';
import { isPath, getRouteForPath, guesstimateRouteForPath } from './utils';

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

  if (route && route.component && typeof route.component === 'function') {
    if (route.middleware && typeof route.middleware === 'function') {
      if (!route.middleware(props)) {
        return;
      }
    }

    route.component(props);
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

  if (isPath(text)) {
    route = getRouteForPath(routes, text);
  } else {
    route = userHistory.locked
      ? getRouteForPath(routes, userHistory.path)
      : guesstimateRouteForPath(routes, text);
  }

  const newHistory = updateUserHistory(historyState.get(), entityRef, {
    path: route.path,
    locked: isPath(text) ? false : userHistory.locked,
    state: userHistory.locked ? userHistory.state : {},
  });

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
