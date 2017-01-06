import { createAction } from 'redux-actions';

export const FOLDER_OPEN = 'FOLDER_OPEN';
export const FOLDER_CLOSE = 'FOLDER_CLOSE';
export const FOLDER_CHANGE = 'FOLDER_CHANGE';

export const openFolder = createAction(FOLDER_OPEN, path => ({ path }));
export const closeFolder = createAction(FOLDER_CLOSE);
export const changeFolder = createAction(FOLDER_CHANGE, file => ({ file }));
