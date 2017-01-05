/* eslint-disable no-unused-expressions */
import expect from 'expect';
import React from 'react';
import { mount } from 'enzyme';
import Panel from '../../app/components/Panel';

function setup() {
  const component = mount(<Panel className="test"><span>TEST</span></Panel>);
  return {
    component,
    span: component.find('span')
  };
}

describe('Panel component', () => {
  it('should panel should have classes', () => {
    const { component } = setup();
    expect(component.hasClass('panel')).toExist();
    expect(component.hasClass('test')).toExist();
  });

  it('should panel should render children', () => {
    const { span } = setup();
    expect(span.text()).toEqual('TEST');
  });
});
