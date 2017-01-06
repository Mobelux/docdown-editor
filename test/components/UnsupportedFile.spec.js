/* eslint-disable no-unused-expressions */
import expect from 'expect';
import React from 'react';
import { mount } from 'enzyme';
import UnsupportedFile from '../../app/components/UnsupportedFile';

function setup() {
  const component = mount(<UnsupportedFile name="test.pdf" />);
  return {
    component,
    span: component.find('span')
  };
}

describe('File component', () => {
  it('should span should display name', () => {
    const { span } = setup();
    expect(span.text()).toMatch(/test.pdf$/);
  });
});
