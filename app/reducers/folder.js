import { Map } from 'immutable';
import { handleActions } from 'redux-actions';
import {
  FOLDER_OPEN, FOLDER_CLOSE, FOLDER_CHANGE
} from '../actions/folder';

const initialState = Map({
  path: null,
  files: Map({})
});

const folderReducer = handleActions({
  [FOLDER_OPEN]: (state, { payload }) => {
    const { path } = payload;
    return state.set('path', path);
  },
  [FOLDER_CLOSE]: () => initialState,
  [FOLDER_CHANGE]: (state, { payload }) => {
    const { changes } = payload;
    let files = state.get('files');

    files = changes
      .filter(file => ['add', 'addDir'].indexOf(file.event) > -1)
      .reduce((acc, file) => acc.set(file.name, file.event === 'addDir'), files);

    files = changes
      .filter(file => ['unlink', 'unlinkDir'].indexOf(file.event) > -1)
      .reduce((acc, file) => {
        const idx = acc.indexOf(file.name);
        return files.delete(idx);
      }, files);

    return state.set('files', files);
  }
}, initialState);

export default folderReducer;
