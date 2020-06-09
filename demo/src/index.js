import { BotDesigner, africastalkingPlugin, telegramPlugin, twilioWhatsappPlugin, smsPlugin, ussdPlugin } from 'bot-designer';

const bot = BotDesigner();

botDesigner.use(telegramPlugin());
botDesigner.use(twilioWhatsappPlugin());
botDesigner.use(smsPlugin());
botDesigner.use(ussdPlugin());
bot.use(africastalkingPlugin({
  
}));

bot.setRoutes([
  {
    path: '**',
    component: ({ onSendMessage }) => onSendMessage('hello world'),
  },
]);
