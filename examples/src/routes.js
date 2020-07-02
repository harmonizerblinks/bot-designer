export const routes = [
  {
    path: '**',
    aliases: ['text'],
    component: ({ onSendMessage }) => onSendMessage('Hello world'),
  },
  {
    path: 'photo',
    component: ({ onSendPhoto }) => onSendPhoto('https://bit.ly/38lrqcs', 'Hello Photo'),
  },
  {
    path: 'audio',
    component: ({ onSendAudio }) => onSendAudio('https://bit.ly/2YSS8pF', 'Hello Audio'),
  },
  {
    path: 'video',
    component: ({ onSendVideo }) => onSendVideo('https://bit.ly/3iyURN0', 'Hello Video'),
  },
  {
    path: 'document',
    component: ({ onSendDocument }) => onSendDocument('https://bit.ly/2YSZKbT', 'Hello Document'),
  },
  {
    path: 'location',
    component: ({ onSendLocation }) => onSendLocation(-1.2697402, 36.7348116),
  },
];
