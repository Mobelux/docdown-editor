/* global jest, describe, it, expect, beforeEach */
import * as matchers from 'jest-immutable-matchers';
import { Map } from 'immutable';
import filesReducer from '../../app/reducers/files';
import {
  FILE_NEW, FILE_OPEN, FILE_CLOSE_CONFIRMED, FILE_SELECT,
  FILE_UPDATE, FILE_DISCARD
} from '../../app/actions/files';

describe('files reducer', () => {
  beforeEach(() => {
    jest.addMatchers(matchers);
  });

  it('should handle initial state', () => {
    const initial = Map({
      files: Map({}),
      paths: Map({}),
      currentFile: null
    });
    expect(filesReducer(undefined, { type: 'none' })).toEqualImmutable(initial);
  });

  it('should handle FILE_NEW', () => {
    const start = Map({
      files: Map({}),
      paths: Map({}),
      currentFile: null
    });
    const end = Map({
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

  it('should handle FILE_OPEN', () => {
    const start = Map({
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
      files: Map({
        1234: Map({
          name: 'this.md',
          path: null,
          contents: '',
          changed: false,
          anchor: 0,
          focus: 0
        })
      }),
      paths: Map({
        '/tmp/this.md': '1234'
      }),
      currentFile: '1234'
    });
    expect(filesReducer(start, { type: FILE_OPEN, payload: { path: '/tmp/this.md' } })).toEqualImmutable(end);
  });

  it('should handle FILE_CLOSE_CONFIRMED', () => {
    const start = Map({
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
      files: Map({}),
      paths: Map({}),
      currentFile: null
    });
    expect(filesReducer(start, { type: FILE_CLOSE_CONFIRMED, payload: { id: '1234' } })).toEqualImmutable(end);
  });

  it('should handle FILE_DISCARD', () => {
    const start = Map({
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
      files: Map({}),
      paths: Map({}),
      currentFile: null
    });
    expect(filesReducer(start, { type: FILE_DISCARD, payload: { id: '1234' } })).toEqualImmutable(end);
  });

  it('should handle FILE_SELECT', () => {
    const start = Map({
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
