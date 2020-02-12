import { Application } from 'express';
import { MessageCallback } from '../main/render.interface';
export declare const whatsappPlugin: (twilioChannel: string, accountSid: string, authToken: string) => (app: Application, cb: MessageCallback) => void;
