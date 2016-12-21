import { createAction } from 'redux-actions';

export const REPLACER_FIND = 'TEXT_FIND';
export const REPLACER_REPLACE = 'TEXT_REPLACE';
export const REPLACER_REPLACE_ALL = 'TEXT_REPLACE_ALL';
export const REPLACER_CLEAR = 'TEXT_CLEAR';

export const findText = createAction(REPLACER_FIND, find => ({ find }));
export const replaceText = createAction(REPLACER_REPLACE, (find, replace) => ({ find, replace }));
export const replaceAllText = createAction(REPLACER_REPLACE_ALL, (find, replace) => ({ find, replace }));
export const clearText = createAction(REPLACER_CLEAR);
