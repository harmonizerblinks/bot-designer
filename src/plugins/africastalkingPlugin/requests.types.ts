import { FreeFormObject } from '../../utils/misc.types';
import { Credentials, Channel } from './index.types';

export interface RequestOptions {
  credentials: Credentials,
  endpoint: 'consent' | 'send';
  channel: Channel;
  to: string;
  data: FreeFormObject;
}
