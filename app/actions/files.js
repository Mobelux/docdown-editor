import { createAction } from 'redux-actions';

export const FILE_OPEN = 'FILE_OPEN';
export const FILE_CLOSE = 'FILE_CLOSE';
export const FILE_SELECT = 'FILE_SELECT';
export const FILE_SAVE = 'FILE_SAVE';
export const FILE_UPDATE = 'FILE_UPDATE';

export const openFile = createAction(FILE_OPEN);
export const closeFile = createAction(FILE_CLOSE);
export const selectFile = createAction(FILE_SELECT);
export const saveFile = createAction(FILE_SAVE);
export const updateFile = createAction(FILE_UPDATE);
