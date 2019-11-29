import { CustomObject } from '../utils/misc.interface';
import { Channel } from '../main/render.interface';

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
