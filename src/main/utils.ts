import { Route } from './render.interface';

export const guesstimateRoute = (routes: Route[], message: string): Route | undefined => {
  const updatedRoutes = routes.map((r) => ({
    paths: [
      r.path,
      ...(r.aliases || []),
    ],
    middleware: r.middleware,
    component: r.component,
  }))
    .map((r) => ({
      ...r,
      paths: r.paths.reduce((acc, curr) => {
        if (curr.includes(' ') || curr === '**') {
          return [...acc, curr];
        }

        return [
          ...acc,
          curr,
          isCommand(curr) ? curr.slice(1) : `/${curr}`,
        ];
      }, []),
    }));

  for (let i = 0; i < updatedRoutes.length; i += 1) {
    const route = updatedRoutes[i];

    for (let j = 0; j < route.paths.length; j += 1) {
      if (message.toLowerCase().includes(route.paths[j].toLowerCase())) {
        return routes.find((_r, idx) => idx === i);
      }
    }
  }

  return routes.find((r) => r.path === '**');
};

export const isCommand = (str: string): boolean => str.split(' ').length === 1 && str.charAt(0) === '/';
