import { Map } from 'immutable';
import { handleActions } from 'redux-actions';
import uuid from 'uuid/v4';
import fileReducer from './file';
import {
  FILE_NEW, FILE_OPEN, FILE_READ, FILE_CLOSE_CONFIRMED, FILE_SELECT,
  FILE_SAVE_CONFIRMED, FILE_SAVE_AS, FILE_WRITE, FILE_UPDATE, FILE_SELECTION, FILE_DISCARD
} from '../actions/files';
import { REPLACER_FIND, REPLACER_REPLACE, REPLACER_REPLACE_ALL } from '../actions/replacer';

const initialState = Map({
  files: Map({}),
  paths: Map({}),
  currentFile: null
});

const filesReducer = handleActions({
  [FILE_NEW]: (state, { payload }) => {
    const { id } = payload;
    return state
      .update('files', files => files.set(id, fileReducer(undefined, { type: FILE_NEW })))
      .set('currentFile', id);
  },
  [FILE_OPEN]: (state, action) => {
    const { payload: { path } } = action;
    const currentFile = state.get('currentFile');
    let paths = state.get('paths');
    let files = state.get('files');
    let file = state.getIn(['files', currentFile]);
    let id;
    if (files.size === 1 && !file.get('path') && file.get('contents') === '') {
      file = fileReducer(file, action);
      id = currentFile;
    } else {
      id = state.getIn(['paths', path], uuid());
      file = state.getIn(['files', id], fileReducer(file, action));
    }
    paths = paths.set(path, id);
    files = files.set(id, file);
    return state.merge({ currentFile: id, files, paths });
  },
  [FILE_READ]: (state, action) => {
    const { payload: { path } } = action;
    const paths = state.get('paths');
    const id = paths.get(path);
    return state.updateIn(['files', id], file => fileReducer(file, action));
  },
  [FILE_CLOSE_CONFIRMED]: (state, { payload }) => {
    let { id } = payload;
    if (!id) {
      id = state.get('currentFile');
    }
    const files = state.get('files');
    const paths = state.get('paths');
    const file = files.get(id);
    let currentFile = state.get('currentFile');
    if (id === currentFile) {
      const otherFile = files.filter((f, idx) => idx !== id).last();
      if (otherFile) {
        currentFile = paths.get(otherFile.get('path'));
      } else {
        currentFile = null;
      }
    }
    return state.merge({ currentFile, files: files.delete(id), paths: paths.delete(file.get('path')) });
  },
  [FILE_DISCARD]: (state, { payload }) => {
    const { id } = payload;
    const files = state.get('files');
    const paths = state.get('paths');
    const file = files.get(id);
    let currentFile = state.get('currentFile');
    if (id === currentFile) {
      const otherFile = files.filter((f, idx) => idx !== id).last();
      if (otherFile) {
        currentFile = paths.get(otherFile.get('path'));
      } else {
        currentFile = null;
      }
    }
    return state.merge({ currentFile, files: files.delete(id), paths: paths.delete(file.get('path')) });
  },
  [FILE_SELECT]: (state, { payload }) => {
    const { id } = payload;
    return state.set('currentFile', id);
  },
  [FILE_UPDATE]: (state, action) => {
    const id = state.get('currentFile');
    return state.updateIn(['files', id], file => fileReducer(file, action));
  },
  [FILE_SELECTION]: (state, action) => {
    const id = state.get('currentFile');
    return state.updateIn(['files', id], file => fileReducer(file, action));
  },
  [FILE_SAVE_CONFIRMED]: (state, action) => {
    let { payload: { id } } = action;
    if (!id) {
      id = state.get('currentFile');
    }
    return state.updateIn(['files', id], file => fileReducer(file, action));
  },
  [FILE_SAVE_AS]: (state, action) => {
    const { payload: { id, path } } = action;
    return state
      .update('paths', paths => paths.set(path, id))
      .updateIn(['files', id], file => fileReducer(file, action));
  },
  [FILE_WRITE]: (state, action) => {
    let { payload: { id } } = action;
    if (!id) {
      id = state.get('currentFile');
    }
    return state.updateIn(['files', id], file => fileReducer(file, action));
  },
  [REPLACER_FIND]: (state, action) => {
    const id = state.get('currentFile');
    return state.updateIn(['files', id], file => fileReducer(file, action));
  },
  [REPLACER_REPLACE]: (state, action) => {
    const id = state.get('currentFile');
    return state.updateIn(['files', id], file => fileReducer(file, action));
  },
  [REPLACER_REPLACE_ALL]: (state, action) => {
    const id = state.get('currentFile');
    return state.updateIn(['files', id], file => fileReducer(file, action));
  }
}, initialState);

export default filesReducer;
