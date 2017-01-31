/* global jest, describe, it, expect */
/* eslint-disable no-unused-expressions */
import React from 'react';
import { mount } from 'enzyme';
import File from '../../app/components/File';

function setup() {
  const actions = {
    handleClick: jest.fn()
  };
  const component = mount(<File path="/tmp/test.md" name="test.md" {...actions} />);
  return {
    component,
    actions,
    link: component.find('a'),
    span: component.find('span')
  };
}

describe('File component', () => {
  it('should span should display name', () => {
    const { span } = setup();
    expect(span.text()).toMatch(/test.md$/);
  });

  it('should link should call handleClick', () => {
    const { link, actions } = setup();
    link.simulate('click');
    expect(actions.handleClick.mock.calls.length).toBeTruthy();
  });
});
