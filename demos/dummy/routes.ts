import { Route } from '../../src';
import { Start } from './components/Start';
import { Message } from './components/Message';
import { Photo } from './components/Photo';
import { Audio } from './components/Audio';
import { Video } from './components/Video';
import { Document } from './components/Document';
import { Location } from './components/Location';
import { Contact } from './components/Contact';

export const routes: Route[] = [
  { path: 'start', aliases: ['menu'], component: Start },
  { path: 'message', component: Message },
  { path: 'photo', component: Photo },
  { path: 'audio', component: Audio },
  { path: 'video', component: Video },
  { path: 'document', aliases: ['pdf'], component: Document },
  { path: 'contact', component: Contact },
  { path: 'location', component: Location },
];
