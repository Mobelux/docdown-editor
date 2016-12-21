import { createAction } from 'redux-actions';

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
export const newFile = createAction(FILE_NEW);
export const openFile = createAction(FILE_OPEN, path => ({ path }));
export const closeFile = createAction(FILE_CLOSE, id => ({ id }));
export const selectFile = createAction(FILE_SELECT, id => ({ id }));
export const saveFile = createAction(FILE_SAVE, id => ({ id }));
export const saveAsFile = createAction(FILE_SAVE_AS, (id, path) => ({ id, path }));
export const updateFile = createAction(FILE_UPDATE, text => ({ text }));
export const updateSelection = createAction(FILE_SELECTION, selection => ({ selection }));
export const discardFile = createAction(FILE_DISCARD, id => ({ id }));
