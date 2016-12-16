import { createAction } from 'redux-actions';

export const TEXT_FIND = 'TEXT_FIND';
export const TEXT_REPLACE = 'TEXT_REPLACE';
export const TEXT_REPLACE_ALL = 'TEXT_REPLACE_ALL';
export const TEXT_CLEAR = 'TEXT_CLEAR';

export const findText = createAction(TEXT_FIND, find => ({ find }));
export const replaceText = createAction(TEXT_REPLACE, (find, replace) => ({ find, replace }));
export const replaceAllText = createAction(TEXT_REPLACE_ALL, (find, replace) => ({ find, replace }));
export const clearText = createAction(TEXT_CLEAR);
