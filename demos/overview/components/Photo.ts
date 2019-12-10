import { Component } from '../../../src';
import { baseUrl } from '../constants';

export const Photo: Component = (props) => {
  if (props.onSendPhoto) {
    props.onSendPhoto(`${baseUrl}/assets/image.jpg`, 'Here is your photo');
  } else {
    props.onSendMessage('Photo Method not available');
  }
};
