import { Component } from '../../src';
import { validateMeterNumber } from '../utils/validations';

export const BuyTokens: Component = (props) => {
  const steps = ['INIT', 'REQUEST_FOR_METER_NUMBER', 'REQUEST_AMOUNT', 'CONFIRM'];
  const exitKeyword = 'cancel';
  const exitMessage = 'You have cancelled the Buy Tokens request.';
  const hint = '\nTo cancel the Buy Tokens request, reply with: cancel';

  const flow = props.history.createFlow(steps, exitKeyword, exitMessage);
  flow.start();

  switch (flow.getCurrentStep()) {
    case 'INIT':
      props.onSendMessage(`Please enter your Meter Number ${hint}`);
      flow.next();
      break;

    case 'REQUEST_FOR_METER_NUMBER':
      const isValid = validateMeterNumber(props.text);
      if (!isValid) {
        props.onSendMessage(`Please enter a valid 11-digit Meter Number ${hint}`);
        return;
      }

      props.history.setState({
        ...props.history.getState(),
        meterNumber: parseInt(props.text, 10),
      });
      props.onSendMessage(`Please enter the amount in KES ${hint}`);
      flow.next();
      break;

    case 'REQUEST_AMOUNT':
      const amount = parseInt(props.text, 10);
      if (isNaN(amount) || amount < 50) {
        props.onSendMessage(`Please enter an amount greater than KES 50 ${hint}`);
        return;
      }

      props.history.setState({
        ...props.history.getState(),
        amount,
      });
      props.onSendMessage(`Please confirm you want to buy tokens with YES or NO ${hint}`);
      flow.next();
      break;

    case 'CONFIRM':
      const { text: rawText } = props;
      const text = rawText.trim().toUpperCase();

      if (!['YES', 'Y', 'NO', 'N'].includes(text)) {
        props.onSendMessage(`Please reply with either YES or NO ${hint}`);
        return;
      }
      
      if (text === 'Y' || text === 'YES') {
        const { meterNumber, amount } = props.history.getState();
        const successMessage = `You have successfully bought tokens worth KES ${amount} for Meter No. ${meterNumber}.`;

        props.onSendMessage(successMessage);
      } else {
        props.onSendMessage(exitMessage);
      }
      
      flow.end();
      break;
  }
};
