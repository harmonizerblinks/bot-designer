import { Component } from '../../src';

// https://kplc.co.ke/category/view/27/faqs

export const Faq: Component = (props) => {
  const steps = ['INIT', 'SELECT_QUESTION'];
  const flow = props.history.createFlow(steps, 'cancel', 'You have cancelled the FAQ request');
  flow.start();

  switch (flow.getCurrentStep()) {
    case 'INIT':
      let msg = 'Frequently Asked Questions (FAQ)\n';
      msg += faqs
        .map((f) => f.title)
        .map((t, idx) => `\n${idx + 1}: ${t}`)
        .join('');

      props.onSendMessage(msg);
      flow.next();
      break;

    case 'SELECT_QUESTION':
      let { text } = props;
      if (props.channel === 'USSD') {
        text = text.split('*').slice(-1)[0];
      }

      const idx = parseInt(text, 10);

      if (isNaN(idx)) {
        props.render(props.text);
        return;
      }

      if (idx > faqs.length) {
        props.render('**');
        return;
      }

      props.onSendMessage(`${faqs[idx - 1].title} \n\n${faqs[idx - 1].body}`);
      flow.end();
      break;
  }
};

const faqs = [
  {
    title: 'How much power can I buy?',
    body: 'You can buy as much power as you wish.',
  },
  {
    title: 'What happens to my current electricity deposit when i install a prepaid meter?',
    body: 'Your current electricity deposit will be refunded if you have no debt.',
  },
  {
    title: 'Will the meter affect my geyser/hot water?',
    body: 'No, the meter will not affect your geyser/hot water.',
  },
  {
    title: 'How will the Kenya Power technician be identified?',
    body: 'Kenya Power technician will come in a team and bear a company identification card. He will also have a prepayment meter, which will be used to replace the existing credit meter.',
  },
];
