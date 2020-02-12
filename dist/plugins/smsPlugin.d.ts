import { Application } from 'express';
import { MessageCallback } from '../main/render.interface';
export declare const smsPlugin: (apiKey: string, username: string, shortcode: string) => (app: Application, cb: MessageCallback) => void;
