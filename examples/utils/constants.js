import config from 'config';

export const CONSTANTS = {
  twilio: config.get('twilio'),
  telegram: config.get('telegram'),
  africastalking: config.get('africastalking'),
};
