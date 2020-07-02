import { BotDesigner, telegramPlugin, atSmsPlugin, twilioWhatsappPlugin, atUssdPlugin, atChatPlugin } from 'bot-designer';
import { CONSTANTS } from '../utils/constants';

const botDesigner = BotDesigner();

botDesigner.setRoutes([
  {
    path: '**',
    aliases: ['text'],
    component: ({ onSendMessage }) => onSendMessage('Hello world'),
  },
  {
    path: 'photo',
    aliases: ['image', 'jpg'],
    component: ({ onSendPhoto }) => onSendPhoto('https://www.fonewalls.com/wp-content/uploads/1536x2048-Background-HD-Wallpaper-213.jpg', 'Hello Photo'),
  },
  {
    path: 'audio',
    aliases: ['mp3'],
    component: ({ onSendAudio }) => onSendAudio('https://file-examples.com/wp-content/uploads/2017/11/file_example_MP3_700KB.mp3', 'Hello Audio'),
  },
  {
    path: 'video',
    aliases: ['mp4'],
    component: ({ onSendVideo }) => onSendVideo('https://file-examples.com/wp-content/uploads/2017/04/file_example_MP4_480_1_5MG.mp4', 'Hello Video'),
  },
  {
    path: 'document',
    aliases: ['pdf'],
    component: ({ onSendDocument }) => onSendDocument('http://africau.edu/images/default/sample.pdf', 'Hello Document'),
  },
  {
    path: 'location',
    aliases: ['pin'],
    component: ({ onSendLocation }) => onSendLocation(-1.2697402, 36.7348116),
  },
]);

const { 
  telegram: { token }, 
  twilio: { channel, accountSid, authToken }, 
  africastalking: { apiKey, username, sms: { shortcode }, chat },
} = CONSTANTS;

botDesigner.use(telegramPlugin(token));
botDesigner.use(twilioWhatsappPlugin(channel, accountSid, authToken));
// botDesigner.use(atSmsPlugin(apiKey, username, shortcode));
// botDesigner.use(atUssdPlugin());
botDesigner.use(atChatPlugin(apiKey, username, chat));
