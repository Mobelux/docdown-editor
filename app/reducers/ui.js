/* global document */
import { Map } from 'immutable';
import { handleActions } from 'redux-actions';
import {
  SIDEBAR_TOGGLE, PANE_TOGGLE, COUNT_TOGGLE, PANE_RESIZE, SIDEBAR_RESIZE,
  FONT_SIZE_INCREASE, FONT_SIZE_DECREASE, FONT_SIZE_RESET
} from '../actions/ui';
import { FOLDER_OPEN } from '../actions/files';


const initialState = Map({
  sidebarVisible: false,
  paneVisible: true,
  countVisible: true,
  paneSize: (document.documentElement.clientWidth / 2),
  sidebarSize: 250,
  fontSize: 90
});

const uiReducer = handleActions({
  [SIDEBAR_TOGGLE]: (state) => {
    const sidebarVisible = !state.get('sidebarVisible');
    const sidebarSize = state.get('sidebarSize');
    let paneSize = state.get('paneSize');
    if (sidebarVisible) {
      paneSize -= (sidebarSize / 2);
    } else {
      paneSize += (sidebarSize / 2);
    }
    return state.merge({ sidebarVisible, paneSize });
  },
  [PANE_TOGGLE]: state => (state.set('paneVisible', !state.get('paneVisible'))),
  [COUNT_TOGGLE]: state => (state.set('countVisible', !state.get('countVisible'))),
  [FOLDER_OPEN]: state => (state.set('sidebarVisible', true)),
  [PANE_RESIZE]: (state, { payload }) => (state.set('paneSize', payload)),
  [SIDEBAR_RESIZE]: (state, { payload }) => (state.set('sidebarSize', payload)),
  [FONT_SIZE_INCREASE]: (state) => {
    const newSize = state.get('fontSize') >= 200 ? state.get('fontSize') : state.get('fontSize') + 10;
    return state.set('fontSize', newSize);
  },
  [FONT_SIZE_DECREASE]: (state) => {
    const newSize = state.get('fontSize') <= 20 ? state.get('fontSize') : state.get('fontSize') - 10;
    return state.set('fontSize', newSize);
  },
  [FONT_SIZE_RESET]: state => (state.set('fontSize', 90))
}, initialState);
export default uiReducer;
