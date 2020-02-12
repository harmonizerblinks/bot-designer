import { Application } from 'express';
import { MessageCallback } from '../main/render.interface';
export declare const telegramPlugin: (token: string) => (_app: Application, cb: MessageCallback) => void;
