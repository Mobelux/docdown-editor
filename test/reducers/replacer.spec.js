/* global jest, describe, it, expect, beforeEach */
import * as matchers from 'jest-immutable-matchers';
import { Map } from 'immutable';
import replacerReducer from '../../app/reducers/replacer';
import { REPLACER_FIND, REPLACER_REPLACE, REPLACER_REPLACE_ALL, REPLACER_CLEAR } from '../../app/actions/replacer';
import { FOLDER_OPEN, FILE_NEW, FILE_OPEN, FILE_CLOSE, FILE_SELECT } from '../../app/actions/files';

describe('replacer reducer', () => {
  beforeEach(() => {
    jest.addMatchers(matchers);
  });

  it('should handle initial state', () => {
    const initial = Map({
      find: null,
      replace: null,
      count: 0,
      update: false
    });
    expect(replacerReducer(undefined, { type: 'none' })).toEqualImmutable(initial);
  });

  it('should handle REPLACER_FIND', () => {
    const start = Map({
      find: null,
      replace: null,
      count: 0,
      update: false
    });
    const end = Map({
      find: 'needle',
      replace: null,
      count: 1,
      update: false
    });
    expect(replacerReducer(start, { type: REPLACER_FIND, payload: { find: 'needle' } })).toEqualImmutable(end);
  });

  it('should handle REPLACER_REPLACE', () => {
    const start = Map({
      find: null,
      replace: null,
      count: 0,
      update: false
    });
    const end = Map({
      find: 'needle',
      replace: 'thread',
      count: 1,
      update: true
    });
    expect(replacerReducer(start, {
      type: REPLACER_REPLACE,
      payload: { find: 'needle', replace: 'thread' }
    })).toEqualImmutable(end);
    expect(replacerReducer(end, {
      type: REPLACER_REPLACE,
      payload: { find: 'needle', replace: 'thread' }
    })).toEqualImmutable(end.set('count', 2));
  });

  it('should handle REPLACER_REPLACE_ALL', () => {
    const start = Map({
      find: null,
      replace: null,
      count: 0,
      update: false
    });
    const end = Map({
      find: 'trump',
      replace: 'anyone else',
      count: 0,
      update: true
    });
    expect(replacerReducer(start, {
      type: REPLACER_REPLACE_ALL,
      payload: { find: 'trump', replace: 'anyone else' }
    })).toEqualImmutable(end);
  });

  it('should handle REPLACER_CLEAR', () => {
    const start = Map({
      find: 'needle',
      replace: null,
      count: 1,
      update: false
    });
    const initial = Map({
      find: null,
      replace: null,
      count: 0,
      update: false
    });
    expect(replacerReducer(start, { type: REPLACER_CLEAR })).toEqualImmutable(initial);
  });

  it('should handle FOLDER_OPEN', () => {
    const start = Map({
      find: 'something',
      replace: 'else',
      count: 123,
      update: true
    });
    const initial = Map({
      find: null,
      replace: null,
      count: 0,
      update: false
    });
    expect(replacerReducer(start, { type: FOLDER_OPEN })).toEqualImmutable(initial);
  });

  it('should handle FILE_NEW', () => {
    const start = Map({
      find: 'something',
      replace: 'else',
      count: 123,
      update: true
    });
    const initial = Map({
      find: null,
      replace: null,
      count: 0,
      update: false
    });
    expect(replacerReducer(start, { type: FILE_NEW })).toEqualImmutable(initial);
  });

  it('should handle FILE_OPEN', () => {
    const start = Map({
      find: 'something',
      replace: 'else',
      count: 123,
      update: true
    });
    const initial = Map({
      find: null,
      replace: null,
      count: 0,
      update: false
    });
    expect(replacerReducer(start, { type: FILE_OPEN })).toEqualImmutable(initial);
  });

  it('should handle FILE_CLOSE', () => {
    const start = Map({
      find: 'something',
      replace: 'else',
      count: 123,
      update: true
    });
    const initial = Map({
      find: null,
      replace: null,
      count: 0,
      update: false
    });
    expect(replacerReducer(start, { type: FILE_CLOSE })).toEqualImmutable(initial);
  });

  it('should handle FILE_SELECT', () => {
    const start = Map({
      find: 'something',
      replace: 'else',
      count: 123,
      update: true
    });
    const initial = Map({
      find: null,
      replace: null,
      count: 0,
      update: false
    });
    expect(replacerReducer(start, { type: FILE_SELECT })).toEqualImmutable(initial);
  });

  it('should handle unknown action type', () => {
    expect(replacerReducer(Map({}), { type: 'unknown' })).toEqualImmutable(Map({}));
  });
});
