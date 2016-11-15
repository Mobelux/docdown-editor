import { createAction } from 'redux-actions';

export const SIDEBAR_TOGGLE = 'SIDEBAR_TOGGLE';
export const PANE_RESIZE = 'PANE_RESIZE';

export const toggleSidebar = createAction(SIDEBAR_TOGGLE);
export const resizePane = createAction(PANE_RESIZE);
