import { CustomObject } from '../utils/misc.interface';
import { History } from './history.interface';

export const getUserHistory = (history: History[],
  entityRef: string): History | undefined => history.find((h) => h.entityRef === entityRef);

export const createUserHistory = (history: History[], entityRef: string): History[] => [
  ...history,
  {
    id: history.length + 1,
    entityRef,
    path: '',
    locked: false,
    state: {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const updateUserHistory = (history: History[], entityRef: string,
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
