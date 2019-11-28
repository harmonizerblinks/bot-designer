import { Component, isEmptyObject } from '../../src';
import { HistoryLifecyle, DefaultProps } from '../../src/main/render.interface';

const createFlow = ({ history, text, onSendMessage }: DefaultProps, steps: string[], exitKeyword: string, exitMessage: string) => ({
  begin: () => beginFlow(history, text, onSendMessage, steps, exitKeyword, exitMessage),
  end: () => endFlow(history),
  getCurrentStep: () => getCurrentStep(history, steps),
  next: () => {
    history.setState({
      ...history.getState(),
      currentStepIdx: history.getState().currentStepIdx + 1,
    });
  },
});

const endFlow = (history: HistoryLifecyle): void => {
  history.unlock();
  history.setState({});
};

const beginFlow = (history: HistoryLifecyle, text: string, onSendMessage: Function, steps: string[], exitKeyword: string, exitMessage: string): void => {
  if (text === exitKeyword) {
    endFlow(history);
    onSendMessage(exitMessage);
    return;
  }

  if (isEmptyObject(history.getState()) || !history.getLockStatus()) {
    history.lock();
    history.setState({
      steps,
      currentStepIdx: 0,
    });
  }
};

const getCurrentStep = (history: HistoryLifecyle, steps: string[]): string =>
steps[history.getState().currentStepIdx];

export const BuyTokens: Component = (props) => {
  const steps = ['INIT', 'REQUEST_FOR_METER_NUMBER', 'REQUEST_AMOUNT', 'CONFIRM'];
  const exitKeyword = 'cancel';
  const exitMessage = 'You have cancelled the Buy Tokens process.';

  const flow = createFlow(props, steps, exitKeyword, exitMessage);
  flow.begin();

  switch (flow.getCurrentStep()) {
    case 'INIT':
      props.onSendMessage('Please enter your Meter Number');
      flow.next();
      break;

    case 'REQUEST_FOR_METER_NUMBER':
      const meterNumber = parseInt(props.text, 10);
      if (isNaN(meterNumber) || meterNumber.toString().length !== 11) {
        props.onSendMessage('Please enter a valid 11-digit Meter Number');
        return;
      }

      props.history.setState({
        ...props.history.getState(),
        meterNumber,
      });
      props.onSendMessage('Please enter the amount in KES');
      flow.next();
      break;

    case 'REQUEST_AMOUNT':
      const amount = parseInt(props.text, 10);
      if (isNaN(amount) || amount < 50) {
        props.onSendMessage('Please enter an amount greater than KES 50');
        return;
      }

      props.history.setState({
        ...props.history.getState(),
        amount,
      });
      props.onSendMessage('Please confirm you want to buy tokens with YES or NO');
      flow.next();
      break;

    case 'CONFIRM':
      const { text: rawText } = props;
      const text = rawText.trim().toUpperCase();

      if (!['YES', 'NO', 'Y', 'N'].includes(text)) {
        props.onSendMessage('Please reply with either YES or NO');
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
