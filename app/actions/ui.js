import { createAction } from 'redux-actions';

export const SIDEBAR_TOGGLE = 'SIDEBAR_TOGGLE';
export const PANE_TOGGLE = 'PANE_TOGGLE';
export const COUNT_TOGGLE = 'COUNT_TOGGLE';
export const PANE_RESIZE = 'PANE_RESIZE';
export const SIDEBAR_RESIZE = 'SIDEBAR_RESIZE';
export const FONT_SIZE_INCREASE = 'FONT_SIZE_INCREASE';
export const FONT_SIZE_DECREASE = 'FONT_SIZE_DECREASE';
export const FONT_SIZE_RESET = 'FONT_SIZE_RESET';

export const toggleSidebar = createAction(SIDEBAR_TOGGLE);
export const togglePane = createAction(PANE_TOGGLE);
export const toggleCount = createAction(COUNT_TOGGLE);
export const resizePane = createAction(PANE_RESIZE);
export const resizeSidebar = createAction(SIDEBAR_RESIZE);
export const increaseFontSize = createAction(FONT_SIZE_INCREASE);
export const decreaseFontSize = createAction(FONT_SIZE_DECREASE);
export const resetFontSize = createAction(FONT_SIZE_RESET);
