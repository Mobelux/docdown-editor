/* eslint-disable no-unused-expressions */
import expect, { createSpy } from 'expect';
import React from 'react';
import { mount } from 'enzyme';
import Tab from '../../app/components/Tab';

function setup() {
  const actions = {
    onTabClick: createSpy(),
    onRemoveTab: createSpy()
  };
  const component = mount(<Tab id="123" name="test.md" {...actions} />);
  const activeComponent = mount(<Tab id="234" name="test.md" isActive {...actions} />);
  const changedComponent = mount(<Tab id="345" name="test.md" changed {...actions} />);
  return {
    component,
    activeComponent,
    changedComponent,
    actions,
    link: component.find('a'),
    button: component.find('button'),
    span: component.find('span')
  };
}

describe('Tab component', () => {
  it('should span should display name', () => {
    const { span } = setup();
    expect(span.text()).toMatch(/^test.md$/);
  });

  it('should component should have classes', () => {
    const { component } = setup();
    expect(component.hasClass('tabs__item')).toExist();
  });

  it('should active component should have is-active class', () => {
    const { activeComponent } = setup();
    expect(activeComponent.hasClass('is-active')).toExist();
  });

  it('should changed component should have is-changed class', () => {
    const { changedComponent } = setup();
    expect(changedComponent.hasClass('is-changed')).toExist();
  });

  it('should link should call onTabClick', () => {
    const { link, actions } = setup();
    link.simulate('click');
    expect(actions.onTabClick.calls.length).toExist();
  });

  it('should button should call onRemoveTab', () => {
    const { button, actions } = setup();
    button.simulate('click');
    expect(actions.onRemoveTab.calls.length).toExist();
  });
});
