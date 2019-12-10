import { Component } from '../../../src';

export const Location: Component = (props) => {
  if (props.onSendLocation) {
    props.onSendLocation(-1.270164, 36.770459);
  } else {
    props.onSendMessage('Location Method not available');
  }
};
