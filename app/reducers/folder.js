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
    const { file } = payload;
    switch (file.event) {
      case 'add':
        return state.update('files', files => files.set(file.name, false));
      case 'addDir':
        return state.update('files', files => files.set(file.name, true));
      case 'unlink':
      case 'unlinkDir':
        return state.update('files', (files) => {
          const idx = files.indexOf(payload.path);
          return files.delete(idx);
        });
      default:
        return state;
    }
  }
}, initialState);

export default folderReducer;
