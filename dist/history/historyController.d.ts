import { MutableState } from 'mutablestate.js/dist/interface';
import { HistoryController } from './historyController.interface';
import { History } from './history.interface';
import { OnSendMessage, Channel } from '../main/render.interface';
export declare const historyController: (historyState: MutableState<History[]>, entityRef: string | number, channel: Channel, text: string, onSendMessage: OnSendMessage) => HistoryController;
