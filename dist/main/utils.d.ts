import { Route } from './render.interface';
export declare const isCommand: (str: string) => boolean;
export declare const guesstimateRoute: (routes: Route[], message: string) => Route | undefined;
export declare const getTimeDiffInMins: (start: string) => number;
