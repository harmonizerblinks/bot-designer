import { Application } from 'express';
import { MessageCallback } from '../main/render.interface';
export declare const ussdPlugin: () => (app: Application, cb: MessageCallback) => void;
