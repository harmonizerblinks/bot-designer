import { Application } from 'express';
import { SendMessageOptions, Message } from 'node-telegram-bot-api';
import { MessageInstance } from 'twilio/lib/rest/api/v2010/account/message';
import { CustomObject } from '../utils/misc.interface';
import { HistoryController } from '../history/historyController.interface';
export declare type Render = (text?: string, props?: CustomObject) => void;
export interface Route {
    path: string;
    aliases?: string[];
    middleware?: Middleware[];
    component: Component;
}
export declare type Middleware = (props: CustomObject, next: (props?: CustomObject) => void) => void;
export declare type Component = (props: DefaultProps) => void;
export interface MessageOptions {
    from: string | number;
    text: string;
    channel: Channel;
    onSendMessage: OnSendMessage;
    onSendPhoto?: (photoUrl: string, caption?: string) => Promise<Message | MessageInstance>;
    onSendAudio?: (audioUrl: string, caption?: string) => Promise<any>;
    onSendVideo?: (videoUrl: string, caption?: string) => Promise<any>;
    onSendDocument?: (documentUrl: string, caption?: string) => Promise<any>;
    onSendContact?: (phoneNumber: string, firstName: string, lastName?: string) => Promise<any>;
    onSendLocation?: (latitude: number, longitude: number) => Promise<any>;
}
export declare type Channel = 'WHATSAPP' | 'TELEGRAM' | 'USSD' | 'SMS';
export declare type OnSendMessage = (text: string, opts?: Opts) => Promise<any>;
interface Opts {
    telegram?: SendMessageOptions;
    ussd?: {
        type: 'CON' | 'END';
        showFooter: boolean;
    };
}
export interface DefaultProps extends MessageOptions {
    render: Render;
    history: HistoryController;
}
export declare type MessageCallback = (opts: MessageOptions) => void;
export declare type Plugin = (app: Application, cb: MessageCallback) => void;
export {};
