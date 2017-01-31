/* global describe, it, expect */
/* eslint-disable no-unused-expressions */
import React from 'react';
import { shallow, mount } from 'enzyme';
import MarkdownPreview from '../../app/components/MarkdownPreview';

function setup() {
  const invisibleComponent = shallow(<MarkdownPreview visible={false} />);
  const component = mount(<MarkdownPreview visible content="<strong>TOUGH</strong>" />);
  return {
    invisibleComponent,
    component
  };
}

describe('MarkdownPreview component', () => {
  it('should component should not render when not visible', () => {
    const { invisibleComponent } = setup();
    expect(invisibleComponent.html()).toBeFalsy();
  });

  it('should component should render when visible', () => {
    const { component } = setup();
    expect(component.render()).toBeTruthy();
  });

  it('should div should contain inner html', () => {
    const { component } = setup();
    expect(component.find('strong')).toBeTruthy();
  });

  it('should child div should have classes', () => {
    const { component } = setup();
    expect(component.find('div.rendered')).toBeTruthy();
  });
});
