/* global describe, it, expect */
/* eslint-disable no-unused-expressions */
import React from 'react';
import { shallow } from 'enzyme';
import CharacterCount from '../../app/components/CharacterCount';

function setup() {
  const component = shallow(<CharacterCount text="A string of characters" className="test" />);
  return {
    component
  };
}

describe('CharacterCount component', () => {
  it('should component should contain character count', () => {
    const { component } = setup();
    expect(component.text()).toEqual('19 chars');
  });

  it('should component should have classes', () => {
    const { component } = setup();
    expect(component.hasClass('character-count')).toBeTruthy();
    expect(component.hasClass('test')).toBeTruthy();
  });
});
