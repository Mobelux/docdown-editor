/* eslint-disable no-unused-expressions */
import expect from 'expect';
import React from 'react';
import { mount } from 'enzyme';
import { Map } from 'immutable';
import configureStore from 'redux-mock-store';
import FileTree from '../../app/containers/FileTree';

const mockStore = configureStore([]);

function setup() {
  const store = mockStore({
    folder: Map({
      path: '/tmp/',
      files: Map({
        '/tmp/': true,
        '/tmp/file.md': false
      })
    })
  });
  const emptyStore = mockStore({
    folder: Map({
      path: null,
      files: Map({})
    })
  });
  const container = mount(<FileTree store={store} />);
  const emptyContainer = mount(<FileTree store={emptyStore} />);
  return {
    container,
    emptyContainer
  };
}

describe('FileTree container', () => {
  it('should container should contain 1 child', () => {
    const { container } = setup();
    expect(container.find('li').length).toEqual(1);
  });

  it('should container should have no li', () => {
    const { emptyContainer } = setup();
    expect(emptyContainer.find('li').length).toNotExist();
  });

  it('should container should start expanded', () => {
    const { container } = setup();
    expect(container.find('li ul').length).toEqual(1);
  });
});
