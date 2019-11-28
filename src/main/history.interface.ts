import { CustomObject } from '../utils/misc.interface';

export interface History {
  id: number;
  entityRef: string | number;
  path: string;
  locked: boolean;
  state: CustomObject;
  createdAt: string;
  updatedAt: string;
}
