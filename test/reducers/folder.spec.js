/* global jest, describe, it, expect, beforeEach */
import * as matchers from 'jest-immutable-matchers';
import { Map } from 'immutable';
import folderReducer from '../../app/reducers/folder';
import {
  FOLDER_OPEN, FOLDER_CLOSE
} from '../../app/actions/folder';

describe('folder reducer', () => {
  beforeEach(() => {
    jest.addMatchers(matchers);
  });

  it('should handle initial state', () => {
    const initial = Map({
      path: null,
      files: Map({})
    });
    expect(folderReducer(undefined, { type: 'none' })).toEqualImmutable(initial);
  });

  it('should handle FOLDER_OPEN', () => {
    const start = Map({
      path: null,
      files: Map({})
    });
    const end = Map({
      path: '/tmp/files',
      files: Map({})
    });
    expect(folderReducer(start, { type: FOLDER_OPEN, payload: { path: '/tmp/files' } })).toEqualImmutable(end);
  });

  it('should handle FOLDER_CLOSE', () => {
    const start = Map({
      path: '/tmp/files',
      files: Map({})
    });
    const end = Map({
      path: null,
      files: Map({})
    });
    expect(folderReducer(start, { type: FOLDER_CLOSE })).toEqualImmutable(end);
  });

  it('should handle unknown action type', () => {
    expect(folderReducer(Map({}), { type: 'unknown' })).toEqualImmutable(Map({}));
  });
});
