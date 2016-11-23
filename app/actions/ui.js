import { createAction } from 'redux-actions';

export const SIDEBAR_TOGGLE = 'SIDEBAR_TOGGLE';
export const PANE_TOGGLE = 'PANE_TOGGLE';
export const PANE_RESIZE = 'PANE_RESIZE';
export const SIDEBAR_RESIZE = 'SIDEBAR_RESIZE';

export const toggleSidebar = createAction(SIDEBAR_TOGGLE);
export const togglePane = createAction(PANE_TOGGLE);
export const resizePane = createAction(PANE_RESIZE);
export const resizeSidebar = createAction(SIDEBAR_RESIZE);
