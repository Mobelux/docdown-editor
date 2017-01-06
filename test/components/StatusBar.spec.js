/* eslint-disable no-unused-expressions */
import expect from 'expect';
import React from 'react';
import { shallow, mount } from 'enzyme';
import StatusBar from '../../app/components/StatusBar';

function setup() {
  const invisibleComponent = shallow(<StatusBar visible={false}><span>MORE</span></StatusBar>);
  const component = mount(<StatusBar visible><span>MORE</span></StatusBar>);
  return {
    invisibleComponent,
    component,
    span: component.find('span')
  };
}

describe('StatusBar component', () => {
  it('should component should not render when not visible', () => {
    const { invisibleComponent } = setup();
    expect(invisibleComponent.html()).toNotExist();
  });

  it('should component should have classes', () => {
    const { component } = setup();
    expect(component.hasClass('status-bar')).toExist();
  });

  it('should component should render children', () => {
    const { span } = setup();
    expect(span.text()).toEqual('MORE');
  });
});
