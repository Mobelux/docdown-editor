import fs from 'fs';
import { Map } from 'immutable';
import { handleActions } from 'redux-actions';
import uuid from 'uuid/v4';
import { FOLDER_OPEN, FILE_NEW, FILE_OPEN, FILE_CLOSE, FILE_SELECT, FILE_SAVE, FILE_UPDATE } from '../actions/files';

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
  [FILE_NEW]: (state) => {
    const id = uuid();
    let files = state.get('files');
    const file = Map({
      id,
      name: '',
      path: '',
      contents: '',
      changed: false
    });
    files = files.set(id, file);
    return state.merge({ currentFile: id, files });
  },
  [FILE_OPEN]: (state, { payload }) => {
    const { path } = payload;
    const pieces = path.split('/');
    const name = pieces[pieces.length - 1];
    const id = state.getIn(['paths', path], uuid());
    let paths = state.get('paths');
    let files = state.get('files');
    const file = state.getIn(['files', id], Map({
      id,
      name,
      path,
      contents: fs.readFileSync(path, 'utf8'),
      changed: false
    }));
    paths = paths.set(path, id);
    files = files.set(id, file);
    return state.merge({ currentFile: id, files, paths });
  },
  [FILE_CLOSE]: (state, { payload }) => {
    const { id } = payload;
    const files = state.get('files');
    const paths = state.get('paths');
    const file = files.get(id);
    let currentFile = state.get('currentFile');
    if (id === currentFile) {
      const otherFile = files.filter(f => f.get('id') !== id).last();
      if (otherFile) {
        currentFile = otherFile.get('id');
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
  [FILE_UPDATE]: (state, { payload }) => {
    const { text } = payload;
    const id = state.get('currentFile', uuid());
    let file = state.getIn(['files', id], Map({}));
    file = file.merge({
      id,
      contents: text || '',
      changed: true
    });
    return state.setIn(['files', id], file);
  },
  [FILE_SAVE]: (state) => {
    const id = state.get('currentFile');
    let file = state.getIn(['files', id]);
    fs.writeFileSync(file.get('path'), file.get('contents'));
    file = file.set('changed', false);
    return state.setIn(['files', id], file);
  }
}, initialState);

export default filesReducer;
