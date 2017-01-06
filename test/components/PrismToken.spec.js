/* eslint-disable no-unused-expressions */
import expect from 'expect';
import React from 'react';
import { mount } from 'enzyme';
import PrismToken from '../../app/components/PrismToken';

function setup() {
  const component = mount(<PrismToken type="test1" alias="test2"><div>TEST</div><strong/></PrismToken>);
  return {
    component,
    div: component.find('div')
  };
}

describe('PrismToken component', () => {
  it('should token should have classes', () => {
    const { component } = setup();
    expect(component.hasClass('token')).toExist();
    expect(component.hasClass('test1')).toExist();
    expect(component.hasClass('test2')).toExist();
  });

  it('should panel should render children', () => {
    const { div } = setup();
    expect(div.text()).toEqual('TEST');
  });
});
