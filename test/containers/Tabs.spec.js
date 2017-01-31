/* global describe, it, expect */
/* eslint-disable no-unused-expressions */
import React from 'react';
import { mount } from 'enzyme';
import { Map } from 'immutable';
import configureStore from 'redux-mock-store';
import Tabs from '../../app/containers/Tabs';

const mockStore = configureStore([]);

function setup() {
  const store = mockStore({
    files: Map({
      files: Map({
        1234: Map({
          name: 'main.md',
          changed: false
        }),
        1235: Map({
          name: 'other.md',
          changed: true
        })
      }),
      currentFile: '1234'
    }),
    ui: Map({
      sidebarVisible: true,
      sidebarSize: 200
    })
  });
  const emptyStore = mockStore({
    files: Map({
      files: Map({}),
      currentFile: null
    }),
    ui: Map({
      sidebarVisible: true,
      sidebarSize: 200
    })
  });
  const container = mount(<Tabs store={store} />);
  const emptyContainer = mount(<Tabs store={emptyStore} />);
  return {
    container,
    emptyContainer
  };
}

describe('Tabs container', () => {
  it('should container should contain 2 children', () => {
    const { container } = setup();
    expect(container.find('li').length).toEqual(2);
  });

  it('should container should have no li', () => {
    const { emptyContainer } = setup();
    expect(emptyContainer.find('li').length).toBeFalsy();
  });

  it('should tabs should get setup properly', () => {
    const { container } = setup();
    const tabs = container.find('li');
    const activeTab = tabs.first();
    const changedTab = tabs.last();
    expect(activeTab.hasClass('is-active')).toBeTruthy();
    expect(changedTab.hasClass('is-changed')).toBeTruthy();
  });
});
