import { Component } from '../../../src';
import { baseUrl } from '../constants';

export const Audio: Component = (props) => {
  if (props.onSendAudio) {
    props.onSendAudio(`${baseUrl}/assets/audio.mp3`, 'Here is your audio');
  } else {
    props.onSendMessage('Audio Method not available');
  }
};
