import { CustomObject } from '../utils/misc.interface';

export interface History {
  id: number;
  entityRef: string;
  path: string;
  locked: boolean;
  state: CustomObject;
  createdAt: string;
  updatedAt: string;
}
