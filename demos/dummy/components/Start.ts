import { Component } from '../../../src';

export const Start: Component = (props) => {
  props.onSendMessage(`Hi, what would you like to do?
- Send message
- Send photo
- Send audio
- Send video
- Send document
- Send contact
- Send location`);
};
