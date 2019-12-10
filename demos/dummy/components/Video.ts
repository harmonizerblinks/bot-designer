import { Component } from '../../../src';
import { baseUrl } from '../constants';

export const Video: Component = (props) => {
  if (props.onSendVideo) {
    props.onSendVideo(`${baseUrl}/assets/video.mp4`, 'Here is your video');
  } else {
    props.onSendMessage('Video Method not available');
  }
};
