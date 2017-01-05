import expect from 'expect';
import expectImmutable from 'expect-immutable';
import { Map } from 'immutable';
import fileReducer from '../../app/reducers/file';
import {
  FILE_NEW, FILE_OPEN, FILE_READ, FILE_SAVE_AS, FILE_WRITE, FILE_UPDATE, FILE_SELECTION
} from '../../app/actions/files';
import { REPLACER_FIND, REPLACER_REPLACE, REPLACER_REPLACE_ALL } from '../../app/actions/replacer';

expect.extend(expectImmutable);

describe('file reducer', () => {
  it('should handle initial state', () => {
    const initial = Map({
      name: 'Untitled',
      path: null,
      contents: '',
      changed: false,
      anchor: 0,
      focus: 0
    });
    expect(fileReducer(undefined, { type: 'none' })).toEqualImmutable(initial);
  });

  it('should handle FILE_NEW', () => {
    const end = Map({
      name: 'Untitled',
      path: null,
      contents: '',
      changed: false,
      anchor: 0,
      focus: 0
    });
    expect(fileReducer(Map({}), { type: FILE_NEW, payload: { id: '1234' } })).toEqualImmutable(end);
  });

  it('should handle FILE_OPEN', () => {
    const start = Map({
      name: 'Untitled',
      path: null,
      contents: '',
      changed: false,
      anchor: 0,
      focus: 0
    });
    const end = Map({
      name: 'file3.txt',
      path: null,
      contents: '',
      changed: false,
      anchor: 0,
      focus: 0
    });
    expect(fileReducer(start, { type: FILE_OPEN, payload: { path: '/tmp/file3.txt' } })).toEqualImmutable(end);
  });

  it('should handle FILE_READ', () => {
    const start = Map({
      name: 'file3.txt',
      path: null,
      contents: '',
      changed: false
    });
    const end = Map({
      name: 'file3.txt',
      path: '/tmp/file3.txt',
      contents: 'GREAT!',
      changed: false
    });
    expect(fileReducer(start, {
      type: FILE_READ,
      payload: { path: '/tmp/file3.txt', contents: 'GREAT!' }
    })).toEqualImmutable(end);
  });

  it('should handle FILE_SAVE_AS', () => {
    const start = Map({
      name: 'Untitled',
      path: null,
      contents: 'Something here',
      changed: false
    });
    const end = Map({
      name: 'file3.txt',
      path: '/tmp/file3.txt',
      contents: 'Something here',
      changed: false
    });
    expect(fileReducer(start, { type: FILE_SAVE_AS, payload: { path: '/tmp/file3.txt' } })).toEqualImmutable(end);
  });

  it('should handle FILE_WRITE', () => {
    const start = Map({
      name: 'file2.txt',
      path: '/tmp/file2.txt',
      contents: 'Something here',
      changed: true
    });
    const end = Map({
      name: 'file2.txt',
      path: '/tmp/file2.txt',
      contents: 'Something here',
      changed: false
    });
    expect(fileReducer(start, { type: FILE_WRITE })).toEqualImmutable(end);
  });

  it('should handle FILE_UPDATE', () => {
    const start = Map({
      name: 'Untitled',
      path: null,
      contents: 'Something here',
      changed: false
    });
    const end = Map({
      name: 'Untitled',
      path: null,
      contents: 'I love this',
      changed: true
    });
    expect(fileReducer(start, { type: FILE_UPDATE, payload: { text: 'Something here' } })).toEqualImmutable(start);
    expect(fileReducer(start, { type: FILE_UPDATE, payload: { text: 'I love this' } })).toEqualImmutable(end);
  });

  it('should handle FILE_SELECTION', () => {
    const start = Map({
      contents: 'Something here',
      anchor: 0,
      focus: 0
    });
    const end = Map({
      contents: 'Something here',
      anchor: 10,
      focus: 14
    });
    const selection = {
      getAnchorOffset: () => 10,
      getFocusOffset: () => 14
    };
    expect(fileReducer(start, { type: FILE_SELECTION, payload: { selection } })).toEqualImmutable(end);
  });

  it('should handle REPLACER_FIND', () => {
    const start = Map({
      contents: 'Something here',
      anchor: 0,
      focus: 0
    });
    const end = Map({
      contents: 'Something here',
      anchor: 10,
      focus: 14
    });
    expect(fileReducer(start, { type: REPLACER_FIND, payload: { find: 'here' } })).toEqualImmutable(end);
  });

  it('should handle REPLACER_REPLACE', () => {
    const start = Map({
      contents: 'Something here',
      changed: true,
      anchor: 0,
      focus: 0
    });
    const end = Map({
      contents: 'Something there',
      changed: true,
      anchor: 10,
      focus: 15
    });
    expect(fileReducer(start, {
      type: REPLACER_REPLACE,
      payload: { find: 'here', replace: 'there' }
    })).toEqualImmutable(end);
  });

  it('should handle REPLACER_REPLACE_ALL', () => {
    const start = Map({
      contents: 'Something here here here here here',
      changed: true
    });
    const end = Map({
      contents: 'Something there there there there there',
      changed: true
    });
    expect(fileReducer(start, {
      type: REPLACER_REPLACE_ALL,
      payload: { find: 'here', replace: 'there' }
    })).toEqualImmutable(end);
  });

  it('should handle unknown action type', () => {
    expect(fileReducer(Map({}), { type: 'unknown' })).toEqualImmutable(Map({}));
  });
});
