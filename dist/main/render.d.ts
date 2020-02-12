import { MutableState } from 'mutablestate.js/dist/interface';
import { Route, Render, MessageOptions } from './render.interface';
import { History } from '../history/history.interface';
export declare const render: (historyState: MutableState<History[]>, routes: Route[], primaryProps: MessageOptions) => Render;
