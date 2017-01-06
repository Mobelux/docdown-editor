/* eslint-disable no-unused-expressions */
import expect from 'expect';
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
    expect(invisibleComponent.html()).toNotExist();
  });

  it('should component should render when visible', () => {
    const { component } = setup();
    expect(component.render()).toExist();
  });

  it('should div should contain inner html', () => {
    const { component } = setup();
    expect(component.find('strong')).toExist();
  });

  it('should child div should have classes', () => {
    const { component } = setup();
    expect(component.find('div.rendered')).toExist();
  });
});
