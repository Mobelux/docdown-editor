/* global describe, it, expect */
/* eslint-disable no-unused-expressions */
import React from 'react';
import { shallow } from 'enzyme';
import Sidebar from '../../app/components/Sidebar';

function setup() {
  const invisibleComponent = shallow(<Sidebar visible={false} />);
  const component = shallow(<Sidebar visible />);
  return {
    invisibleComponent,
    component
  };
}

describe('Sidebar component', () => {
  it('should component should not render when not visible', () => {
    const { invisibleComponent } = setup();
    expect(invisibleComponent.html()).toBeFalsy();
  });

  it('should component should have classes', () => {
    const { component } = setup();
    expect(component.hasClass('sidebar')).toBeTruthy();
  });
});
