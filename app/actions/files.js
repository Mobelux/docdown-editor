import { createAction } from 'redux-actions';
import uuid from 'uuid/v4';
import { ipcRenderer } from 'electron';

export const FOLDER_OPEN = 'FOLDER_OPEN';
export const FILE_NEW = 'FILE_NEW';
export const FILE_OPEN = 'FILE_OPEN';
export const FILE_CLOSE = 'FILE_CLOSE';
export const FILE_SELECT = 'FILE_SELECT';
export const FILE_SAVE = 'FILE_SAVE';
export const FILE_SAVE_AS = 'FILE_SAVE_AS';
export const FILE_UPDATE = 'FILE_UPDATE';
export const FILE_SELECTION = 'FILE_SELECTION';
export const FILE_DISCARD = 'FILE_DISCARD';

export const openFolder = createAction(FOLDER_OPEN, path => ({ path }));
export const newFile = createAction(FILE_NEW, id => ({ id: (id || uuid()) }));
export const openFile = createAction(FILE_OPEN, path => ({ path }));
export const closeFile = id => (
  (dispatch, getState) => {
    const { files } = getState();
    const fileId = id || files.get('currentFile');
    const allFiles = files.get('files');
    const file = allFiles.get(fileId);
    if (file.get('changed')) {
      ipcRenderer.send('close-unsaved', fileId, file.get('path'));
    } else {
      dispatch({ type: FILE_CLOSE, payload: { fileId } });
    }
  }
);
export const selectFile = createAction(FILE_SELECT, id => ({ id }));
export const saveFile = id => (
  (dispatch, getState) => {
    const { files } = getState();
    const fileId = id || files.get('currentFile');
    const allFiles = files.get('files');
    const file = allFiles.getIn(['files', fileId]);
    if (!file.get('path')) {
      ipcRenderer.send('save-as', fileId);
    } else {
      dispatch({ type: FILE_SAVE, payload: { fileId } });
    }
  }
);
export const saveAsFile = createAction(FILE_SAVE_AS, (id, path) => ({ id, path }));
export const updateFile = createAction(FILE_UPDATE, text => ({ text }));
export const updateSelection = createAction(FILE_SELECTION, selection => ({ selection }));
export const discardFile = createAction(FILE_DISCARD, id => ({ id }));
