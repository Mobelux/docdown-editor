/* eslint-disable no-unused-expressions */
import expect from 'expect';
import React from 'react';
import { mount } from 'enzyme';
import Folder from '../../app/components/Folder';

function setup() {
  const component = mount(<Folder name="files" forceOpen><li>FILE!</li></Folder>);
  const collapsedComponent = mount(<Folder name="files" collapsed ><li>FILE!</li></Folder>);
  return {
    component,
    collapsedComponent,
    link: component.find('a'),
    span: component.find('span'),
    li: component.find('ul li')
  };
}

describe('Folder component', () => {
  it('should span should display name', () => {
    const { span } = setup();
    expect(span.text()).toMatch(/files$/);
  });

  it('should component should render children', () => {
    const { li } = setup();
    expect(li.text()).toEqual('FILE!');
  });

  it('should collapsed component should have no children', () => {
    const { collapsedComponent } = setup();
    expect(collapsedComponent.contains('ul')).toNotExist();
  });
});
