import { Component } from '../../../src';

export const Contact: Component = (props) => {
  if (props.onSendContact) {
    props.onSendContact('+254712345678', 'John', 'Doe');
  } else {
    props.onSendMessage('Contact Method not available');
  }
};
