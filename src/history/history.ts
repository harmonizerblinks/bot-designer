import { CustomObject } from '../utils/misc.types';
import { History } from './history.types';
import { Channel } from '../main/render.types';

export const getUserHistory = (
  history: History[],
  entityRef: string | number,
  channel: Channel,
): History | undefined => history.find((h) => h.entityRef === entityRef && h.channel === channel);

export const createUserHistory = (
  history: History[],
  entityRef: string | number,
  channel: Channel,
): History[] => [
  ...history,
  {
    id: history.length + 1,
    entityRef,
    channel,
    path: '',
    locked: false,
    state: {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const updateUserHistory = (history: History[], entityRef: string | number,
  data: CustomObject): History[] => history.map((h) => {
  if (h.entityRef === entityRef) {
    return {
      ...h,
      ...data,
      updatedAt: new Date().toISOString(),
    };
  }

  return h;
});
