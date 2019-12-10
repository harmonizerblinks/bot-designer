import { Route } from '../../src';

const baseUrl = 'https://tkimathi.ngrok.io/demos/dummy/assets';

export const routes: Route[] = [
  {
    path: 'start',
    aliases: ['menu'],
    component: (props) => props.onSendMessage(`Hi, what would you like to do?
- Send message
- Send photo
- Send audio
- Send video
- Send document
- Send contact
- Send location`),
  },
  {
    path: 'message',
    aliases: ['send message'],
    component: (props) => props.onSendMessage('Hello World'),
  },
  {
    path: 'photo',
    aliases: ['send photo'],
    component: (props) => {
      if (props.onSendPhoto) {
        props.onSendPhoto(`${baseUrl}/image.jpg`, 'Here is your photo');
      } else {
        props.onSendMessage('Photo Method not available');
      }
    },
  },
  {
    path: 'audio',
    aliases: ['send audio'],
    component: (props) => {
      if (props.onSendAudio) {
        props.onSendAudio(`${baseUrl}/audio.mp3`, 'Here is your audio');
      } else {
        props.onSendMessage('Audio Method not available');
      }
    },
  },
  {
    path: 'video',
    aliases: ['send video'],
    component: (props) => {
      if (props.onSendVideo) {
        props.onSendVideo(`${baseUrl}/video.mp4`, 'Here is your video');
      } else {
        props.onSendMessage('Video Method not available');
      }
    },
  },
  {
    path: 'document',
    aliases: ['send document', 'pdf', 'send pdf'],
    component: (props) => {
      if (props.onSendDocument) {
        props.onSendDocument(`${baseUrl}/document.pdf`, 'Here is your document');
      } else {
        props.onSendMessage('Document Method not available');
      }
    },
  },
  {
    path: 'contact',
    aliases: ['send contact'],
    component: (props) => {
      if (props.onSendContact) {
        props.onSendContact('+254712345678', 'John', 'Doe');
      } else {
        props.onSendMessage('Contact Method not available');
      }
    },
  },
  {
    path: 'location',
    aliases: ['send location'],
    component: (props) => {
      if (props.onSendLocation) {
        props.onSendLocation(-1.270164, 36.770459);
      } else {
        props.onSendMessage('Location Method not available');
      }
    },
  },
];
