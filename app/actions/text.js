import { createAction } from 'redux-actions';

export const TEXT_UPDATE = 'TEXT_UPDATE';

export const updateText = createAction(TEXT_UPDATE, text => ({ text }));
