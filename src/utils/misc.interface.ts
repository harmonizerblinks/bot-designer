import { Application } from 'express';

export type CustomObject = {
  [key: string]: any;
};

export type Plugin = (app: Application, cb: Function) => void;
