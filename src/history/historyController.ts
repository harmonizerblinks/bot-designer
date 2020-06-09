import { MutableState } from 'mutablestate.js/dist/interface';
import { HistoryController } from './historyController.types';
import { getUserHistory, updateUserHistory } from './history';
import { History } from './history.types';
import { CustomObject } from '../utils/misc.types';
import { isEmptyObject } from '../utils/misc';
import { OnSendMessage, Channel } from '../main/render.types';

// STATE
const getState = (
  historyState: MutableState<History[]>,
  entityRef: string | number,
  channel: Channel,
): CustomObject => (getUserHistory(historyState.get(), entityRef, channel) as History).state;

const setState = (
  historyState: MutableState<History[]>, entityRef: string | number,
  state: CustomObject,
): void => {
  const newHistory = updateUserHistory(historyState.get(), entityRef, { state });
  historyState.set(newHistory);
};

// LOCK

const getLockStatus = (
  historyState: MutableState<History[]>, entityRef: string | number,
  channel: Channel,
): boolean => (getUserHistory(historyState.get(), entityRef, channel) as History).locked;

const lock = (historyState: MutableState<History[]>, entityRef: string | number): void => {
  const newHistory = updateUserHistory(historyState.get(), entityRef, { locked: true });
  historyState.set(newHistory);
};

const unlock = (historyState: MutableState<History[]>, entityRef: string | number): void => {
  const newHistory = updateUserHistory(historyState.get(), entityRef, { locked: false });
  historyState.set(newHistory);
};

// FLOW

const endFlow = (historyState: MutableState<History[]>, entityRef: string | number): void => {
  unlock(historyState, entityRef);
  setState(historyState, entityRef, {});
};

const startFlow = (
  historyState: MutableState<History[]>, entityRef: string | number,
  channel: Channel, text: string,
  onSendMessage: OnSendMessage, steps: string[], exitKeyword: string,
  exitMessage: string,
): void => {
  if (text === exitKeyword) {
    endFlow(historyState, entityRef);
    onSendMessage(exitMessage);
    return;
  }

  if (isEmptyObject(getState(historyState, entityRef, channel))
    || !getLockStatus(historyState, entityRef, channel)) {
    lock(historyState, entityRef);
    setState(historyState, entityRef, {
      steps,
      currentStepIdx: 0,
    });
  }
};

const getCurrentStep = (
  historyState: MutableState<History[]>, entityRef: string | number,
  channel: Channel, steps: string[],
): string => steps[getState(historyState, entityRef, channel).currentStepIdx];

const flowGoToNext = (historyState: MutableState<History[]>,
  entityRef: string | number, channel: Channel): void => {
  const state = getState(historyState, entityRef, channel);
  setState(historyState, entityRef, {
    ...state,
    currentStepIdx: state.currentStepIdx + 1,
  });
};

// @MAIN

export const historyController = (historyState: MutableState<History[]>,
  entityRef: string | number,
  channel: Channel,
  text: string, onSendMessage: OnSendMessage): HistoryController => ({
  getState: () => getState(historyState, entityRef, channel),
  setState: (state) => {
    const { steps, currentStepIdx } = getState(historyState, entityRef, channel);

    setState(historyState, entityRef, {
      ...state,
      ...(steps && currentStepIdx ? { steps, currentStepIdx } : {}),
    });
  },
  createFlow: (steps: string[], exitKeyword: string, exitMessage: string) => ({
    start: () => startFlow(historyState, entityRef, channel, text, onSendMessage, steps,
      exitKeyword, exitMessage),
    end: () => endFlow(historyState, entityRef),
    getCurrentStep: () => getCurrentStep(historyState, entityRef, channel, steps),
    next: () => flowGoToNext(historyState, entityRef, channel),
  }),
});
