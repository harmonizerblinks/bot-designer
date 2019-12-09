import {
  Superbot, whatsappPlugin, telegramPlugin, smsPlugin, ussdPlugin,
} from '../../src';
import { routes } from './routes';

const superbot = Superbot();

superbot.setRoutes(routes);

superbot.use(whatsappPlugin('whatsapp:+14155238886', 'AC1d8f5cd7cbef961c76cbe728f28461f3',
  '5086b2b6e7d34111f29dfa425f586700'));
superbot.use(telegramPlugin('820530445:AAHVfl2S89L3kVNji9s93qUjxRba2myyKVo'));
superbot.use(smsPlugin('cc10f40b3cc8a6da29e441e53a666c8adffe60ace04becb25d1ff5fb3ad47d36',
  'sandbox', '97531'));
superbot.use(ussdPlugin());
