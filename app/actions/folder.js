import { createAction } from 'redux-actions';

export const FOLDER_OPEN = 'FOLDER_OPEN';
export const FOLDER_CLOSE = 'FOLDER_CLOSE';
export const FOLDER_ADD = 'FOLDER_ADD';
export const FOLDER_REMOVE = 'FOLDER_REMOVE';

export const openFolder = createAction(FOLDER_OPEN, path => ({ path }));
export const closeFolder = createAction(FOLDER_CLOSE);
export const addFolder = createAction(FOLDER_ADD, (path, folder = false) => ({ path, folder }));
export const removeFolder = createAction(FOLDER_REMOVE, (path, folder = false) => ({ path, folder }));
