import { BotDesigner, telegramPlugin } from 'bot-designer';
import { CONSTANTS } from '../utils/constants';

const botDesigner = BotDesigner();

const { telegram: { token } } = CONSTANTS;

botDesigner.use(telegramPlugin(token));

botDesigner.setRoutes([
  {
    path: '**',
    component: ({ onSendMessage }) => {
      onSendMessage('Hello world');
    },
  },
]);
