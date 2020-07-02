import { BotDesigner, telegramPlugin, atSmsPlugin, twilioWhatsappPlugin, atUssdPlugin, atChatPlugin } from 'bot-designer';
import { CONSTANTS } from '../utils/constants';
import { routes } from './routes';

const botDesigner = BotDesigner();

botDesigner.setRoutes(routes);

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
