import { Route } from './render.interface';

export const isPath = (str: string): boolean => str.split(' ').length === 1 && str.charAt(0) === '/';

export const getRouteForPath = (routes: Route[], path: string): Route => {
  let route = routes.find((r) => r.path === path || r.alias === path);

  if (!route) {
    route = routes.find((r) => r.path === '**');
  }

  return route as Route;
};

export const guesstimateRouteForPath = (routes: Route[], message: string): Route => {
  const route: Route | null = routes.reduce((acc: Route | null, curr: Route) => {
    if (acc) {
      return acc;
    }

    (curr.models || []).map((regex: RegExp) => {
      if (regex.test(message)) {
        acc = curr;
      }

      return regex;
    });

    return acc;
  }, null);


  return route || getRouteForPath(routes, '**');
};
