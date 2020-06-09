import { FreeFormObject } from '../utils/misc.types';

export interface HistoryController {
  getState(): FreeFormObject;
  setState(state: FreeFormObject): void;
  createFlow(steps: string[], exitKeyword: string, exitMessage: string): {
    start: () => void,
    end: () => void,
    getCurrentStep: () => string,
    next: () => void,
  };
}
