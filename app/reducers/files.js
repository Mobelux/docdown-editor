import fs from 'fs';
import { Map } from 'immutable';
import { handleActions } from 'redux-actions';
import uuid from 'uuid/v4';
import fileReducer from './file';
import {
  FOLDER_OPEN, FILE_NEW, FILE_OPEN, FILE_CLOSE, FILE_SELECT,
  FILE_SAVE, FILE_SAVE_AS, FILE_UPDATE, FILE_SELECTION, FILE_DISCARD
} from '../actions/files';
import { REPLACER_FIND, REPLACER_REPLACE, REPLACER_REPLACE_ALL } from '../actions/replacer';

const initialState = Map({
  folder: null,
  files: Map({}),
  paths: Map({}),
  currentFile: null
});

const filesReducer = handleActions({
  [FOLDER_OPEN]: (state, { payload }) => {
    const { path } = payload;
    return state.set('folder', path);
  },
  [FILE_NEW]: (state, { payload }) => {
    const { id } = payload;
    let files = state.get('files');
    const file = fileReducer(undefined, { type: FILE_NEW });
    files = files.set(id, file);
    return state.merge({ currentFile: id, files });
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
  [FILE_CLOSE]: (state, { payload }) => {
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
    let file = state.getIn(['files', id]);
    file = fileReducer(file, action);
    return state.setIn(['files', id], file);
  },
  [FILE_SELECTION]: (state, action) => {
    const id = state.get('currentFile');
    let file = state.getIn(['files', id]);
    file = fileReducer(file, action);
    return state.setIn(['files', id], file);
  },
  [FILE_SAVE]: (state, action) => {
    let { payload: { id } } = action;
    if (!id) {
      id = state.get('currentFile');
    }
    let file = state.getIn(['files', id]);
    fs.writeFileSync(file.get('path'), file.get('contents'));
    file = fileReducer(file, action);
    return state.setIn(['files', id], file);
  },
  [FILE_SAVE_AS]: (state, action) => {
    const { payload: { id, path } } = action;
    let file = state.getIn(['files', id]);
    let paths = state.get('paths');
    paths = paths.set(path, id);
    fs.writeFileSync(path, file.get('contents'));
    file = fileReducer(file, action);
    return state.setIn(['files', id], file).set('paths', paths);
  },
  [REPLACER_FIND]: (state, action) => {
    const id = state.get('currentFile');
    let file = state.getIn(['files', id]);
    file = fileReducer(file, action);
    return state.setIn(['files', id], file);
  },
  [REPLACER_REPLACE]: (state, action) => {
    const id = state.get('currentFile');
    let file = state.getIn(['files', id]);
    file = fileReducer(file, action);
    return state.setIn(['files', id], file);
  },
  [REPLACER_REPLACE_ALL]: (state, action) => {
    const id = state.get('currentFile');
    let file = state.getIn(['files', id]);
    file = fileReducer(file, action);
    return state.setIn(['files', id], file);
  }
}, initialState);

export default filesReducer;
