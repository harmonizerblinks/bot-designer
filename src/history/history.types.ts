import { CustomObject } from '../utils/misc.types';
import { Channel } from '../main/render.types';

export interface History {
  id: number;
  entityRef: string | number;
  channel: Channel;
  path: string;
  locked: boolean;
  state: CustomObject;
  createdAt: string;
  updatedAt: string;
}
