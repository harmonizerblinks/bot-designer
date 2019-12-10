import { Component } from '../../../src';
import { validateMeterNumber } from '../utils/validations';
import { getMeterBill } from '../utils/getMeterBill';

export const MeterQuery: Component = async (props) => {
  const steps = ['INIT', 'REQUEST_METER_NUMBER'];
  const hint = '\nTo cancel the Bill/Meter Query request, reply with: cancel';

  const flow = props.history.createFlow(steps, 'cancel', 'You cancelled the Bill/Meter Query request');
  flow.start();

  switch (flow.getCurrentStep()) {
    case 'INIT': {
      props.onSendMessage(`Please enter your Meter No. ${hint}`);
      flow.next();
      break;
    }

    case 'REQUEST_METER_NUMBER': {
      const isValid = validateMeterNumber(props.text);
      if (!isValid) {
        props.onSendMessage(`Please enter a valid 11-digit Meter Number ${hint}`);
        return;
      }

      props.history.setState({
        ...props.history.getState(),
        meterNumber: parseInt(props.text, 10),
      });
      props.onSendMessage('Please wait while your request is processing... \nThis may take up to 2 mins.');

      const { meterNumber } = props.history.getState();

      flow.end();

      if (props.onSendPhoto) {
        const filePath = await getMeterBill(meterNumber);

        props.onSendPhoto(`https://tkimathi.ngrok.io/${filePath}`,
          'Here is your Account/Meter Search Result');
      }

      // TODO: delete photo
      break;
    }

    default: {
      flow.end();
      props.onSendMessage('Something went wrong...');
      break;
    }
  }
};
