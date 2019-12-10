import { Component } from '../../../src';
import { baseUrl } from '../constants';

export const Document: Component = (props) => {
  if (props.onSendDocument) {
    props.onSendDocument(`${baseUrl}/assets/document.pdf`, 'Here is your document');
  } else {
    props.onSendMessage('Document Method not available');
  }
};
