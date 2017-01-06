/* eslint-disable no-unused-expressions */
import expect from 'expect';
import React from 'react';
import { shallow } from 'enzyme';
import Icon from '../../app/components/Icon';

function setup() {
  const component = shallow(<Icon name="test" />);
  return {
    component
  };
}

describe('Icon component', () => {
  it('should svg should contain use', () => {
    const { component } = setup();
    expect(component.find('use')).toExist();
  });

  it('should svg should have icon classes', () => {
    const { component } = setup();
    expect(component.hasClass('icon')).toExist();
    expect(component.hasClass('icon-test')).toExist();
  });
});
