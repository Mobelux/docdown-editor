import fs from 'fs';
import { Map } from 'immutable';
import { handleActions } from 'redux-actions';
import uuid from 'uuid/v4';
import { FILE_OPEN, FILE_CLOSE, FILE_SELECT, FILE_SAVE, FILE_UPDATE } from '../actions/files';

const initialState = Map({
  folder: null,
  files: Map({}),
  paths: Map({}),
  currentFile: null
});

const filesReducer = handleActions({
  [FILE_OPEN]: (state, { payload }) => {
    const { path } = payload;
    const paths = state.get('paths');
    const id = paths.get('path', uuid());
    let files = state.get('files');
    if (!files.get(id)) {
      files = files.set(id, Map({
        id,
        path,
        contents: fs.readFileSync(path, 'utf8'),
        changed: false
      }));
    }
    return state.merge({ files, currentFile: id });
  },
  [FILE_CLOSE]: (state, { payload }) => {
    const { id } = payload;
    const files = state.get('files');
    const paths = state.get('paths');
    const file = files.get(id);
    return state.merge({ files: files.delete(id), paths: paths.delete(file.get('path')) });
  },
  [FILE_SELECT]: (state, { payload }) => {
    const { id } = payload;
    return state.set('currentFile', id);
  },
  [FILE_UPDATE]: (state, { payload }) => {
    const { text } = payload;
    const id = state.get('currentFile');
    let file = state.getIn(['files', id], Map({}));
    file = file.merge({
      id,
      contents: text,
      changed: true
    });
    return state.setIn(['files', id], file);
  },
  [FILE_SAVE]: (state, { payload }) => {
    const { id } = payload;
    let file = state.getIn(['files', id]);
    fs.writeFileSync(file.get('path'), file.get('contents'));
    file = file.set('changed', false);
    return state.setIn(['files', id], file);
  }
}, initialState);

export default filesReducer;
