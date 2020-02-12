import { CustomObject } from '../utils/misc.interface';
export interface HistoryController {
    getState(): CustomObject;
    setState(state: CustomObject): void;
    createFlow(steps: string[], exitKeyword: string, exitMessage: string): {
        start: () => void;
        end: () => void;
        getCurrentStep: () => string;
        next: () => void;
    };
}
