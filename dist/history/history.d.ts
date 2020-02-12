import { CustomObject } from '../utils/misc.interface';
import { History } from './history.interface';
import { Channel } from '../main/render.interface';
export declare const getUserHistory: (history: History[], entityRef: string | number, channel: Channel) => History | undefined;
export declare const createUserHistory: (history: History[], entityRef: string | number, channel: Channel) => History[];
export declare const updateUserHistory: (history: History[], entityRef: string | number, data: CustomObject) => History[];
