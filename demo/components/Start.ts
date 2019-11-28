import { Component } from '../../src';

export const Start: Component = (props) => {
  let msg = 'Welcome to KPLC Selfcare';
  msg += '\n1: Pay Electricity Bill (Buy Tokens)';
  msg += '\n2: Bill/Meter Query';
  msg += '\n3: Planned Interruptions/Outages';
  msg += '\n4: Report Power Outage';
  msg += '\n5: Frequently Asked Questions (FAQ)';

  props.onSendMessage(msg);
};
