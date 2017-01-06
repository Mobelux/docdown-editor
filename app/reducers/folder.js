import { Map } from 'immutable';
import { handleActions } from 'redux-actions';
import {
  FOLDER_OPEN, FOLDER_CLOSE, FOLDER_ADD, FOLDER_REMOVE
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
  [FOLDER_ADD]: (state, { payload }) => {
    const { path, folder } = payload;
    return state.update('files', files => files.set(path, folder));
  },
  [FOLDER_REMOVE]: (state, { payload }) => state.update('files', (files) => {
    const idx = files.indexOf(payload.path);
    return files.delete(idx);
  })
}, initialState);

export default folderReducer;
