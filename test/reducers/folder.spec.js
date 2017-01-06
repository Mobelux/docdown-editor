import expect from 'expect';
import expectImmutable from 'expect-immutable';
import { Map, List } from 'immutable';
import folderReducer from '../../app/reducers/folder';
import {
  FOLDER_OPEN, FOLDER_CLOSE
} from '../../app/actions/folder';

expect.extend(expectImmutable);

describe('folder reducer', () => {
  it('should handle initial state', () => {
    const initial = Map({
      folder: null,
      files: Map({})
    });
    expect(folderReducer(undefined, { type: 'none' })).toEqualImmutable(initial);
  });

  it('should handle FOLDER_OPEN', () => {
    const start = Map({
      folder: null,
      files: Map({})
    });
    const end = Map({
      folder: '/tmp/files',
      files: Map({})
    });
    expect(folderReducer(start, { type: FOLDER_OPEN, payload: { path: '/tmp/files' } })).toEqualImmutable(end);
  });

  it('should handle FOLDER_CLOSE', () => {
    const start = Map({
      folder: '/tmp/files',
      files: Map({})
    });
    const end = Map({
      folder: null,
      files: Map({})
    });
    expect(folderReducer(start, { type: FOLDER_CLOSE })).toEqualImmutable(end);
  });

  it('should handle unknown action type', () => {
    expect(folderReducer(Map({}), { type: 'unknown' })).toEqualImmutable(Map({}));
  });
});
