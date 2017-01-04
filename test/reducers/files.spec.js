import expect from 'expect';
import expectImmutable from 'expect-immutable';
import { Map } from 'immutable';
import filesReducer from '../../app/reducers/files';
import {
  FOLDER_OPEN, FILE_NEW, FILE_OPEN, FILE_CLOSE, FILE_SELECT,
  FILE_SAVE, FILE_SAVE_AS, FILE_UPDATE, FILE_DISCARD
} from '../../app/actions/files';

expect.extend(expectImmutable);

describe('files reducer', () => {
  it('should handle initial state', () => {
    const initial = Map({
      folder: null,
      files: Map({}),
      paths: Map({}),
      currentFile: null
    });
    expect(filesReducer(undefined, { type: 'none' })).toEqualImmutable(initial);
  });

  it('should handle FOLDER_OPEN', () => {
    const start = Map({
      folder: null,
      files: Map({}),
      paths: Map({}),
      currentFile: null
    });
    const end = Map({
      folder: '/tmp/files',
      files: Map({}),
      paths: Map({}),
      currentFile: null
    });
    expect(filesReducer(start, { type: FOLDER_OPEN, payload: { path: '/tmp/files' } })).toEqualImmutable(end);
  });

  it('should handle FILE_NEW', () => {
    const start = Map({
      folder: null,
      files: Map({}),
      paths: Map({}),
      currentFile: null
    });
    const end = Map({
      folder: null,
      files: Map({
        1234: Map({
          name: 'Untitled',
          path: null,
          contents: '',
          changed: false,
          anchor: 0,
          focus: 0
        })
      }),
      paths: Map({}),
      currentFile: '1234'
    });
    expect(filesReducer(start, { type: FILE_NEW, payload: { id: '1234' } })).toEqualImmutable(end);
  });

  it('should handle FILE_DISCARD', () => {
    const start = Map({
      folder: null,
      files: Map({
        1234: Map({
          name: 'Untitled',
          path: null,
          contents: '',
          changed: false,
          anchor: 0,
          focus: 0
        })
      }),
      paths: Map({}),
      currentFile: null
    });
    const end = Map({
      folder: null,
      files: Map({}),
      paths: Map({}),
      currentFile: null
    });
    expect(filesReducer(start, { type: FILE_DISCARD, payload: { id: '1234' } })).toEqualImmutable(end);
  });

  it('should handle FILE_SELECT', () => {
    const start = Map({
      folder: null,
      files: Map({
        1234: Map({
          name: 'Untitled',
          path: null,
          contents: '',
          changed: false,
          anchor: 0,
          focus: 0
        })
      }),
      paths: Map({}),
      currentFile: null
    });
    const end = Map({
      folder: null,
      files: Map({
        1234: Map({
          name: 'Untitled',
          path: null,
          contents: '',
          changed: false,
          anchor: 0,
          focus: 0
        })
      }),
      paths: Map({}),
      currentFile: '1234'
    });
    expect(filesReducer(start, { type: FILE_SELECT, payload: { id: '1234' } })).toEqualImmutable(end);
  });

  it('should handle FILE_UPDATE', () => {
    const start = Map({
      folder: null,
      files: Map({
        1234: Map({
          name: 'Untitled',
          path: null,
          contents: '',
          changed: false,
          anchor: 0,
          focus: 0
        })
      }),
      paths: Map({}),
      currentFile: '1234'
    });
    const end = Map({
      folder: null,
      files: Map({
        1234: Map({
          name: 'Untitled',
          path: null,
          contents: 'Something new!',
          changed: true,
          anchor: 0,
          focus: 0
        })
      }),
      paths: Map({}),
      currentFile: '1234'
    });
    expect(filesReducer(start, { type: FILE_UPDATE, payload: { text: 'Something new!' } })).toEqualImmutable(end);
  });

  it('should handle unknown action type', () => {
    expect(filesReducer(Map({}), { type: 'unknown' })).toEqualImmutable(Map({}));
  });
});
