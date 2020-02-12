import { Application } from 'express';
import { Route, Plugin } from './render.interface';
import { History } from '../history/history.interface';
export declare const Superbot: (expressApplication?: Application | undefined) => {
    setRoutes: (routes: Route[]) => void;
    setHistory: (history: History[]) => void;
    onHistory: (cb: Function) => void;
    use: (plugin: Plugin) => void;
};
