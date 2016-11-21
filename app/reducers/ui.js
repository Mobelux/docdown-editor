/* global document */
import { Map } from 'immutable';
import { handleActions } from 'redux-actions';
import { SIDEBAR_TOGGLE, PANE_TOGGLE, PANE_RESIZE, SIDEBAR_RESIZE } from '../actions/ui';


const initialState = Map({
  sidebarVisible: true,
  paneVisible: true,
  paneSize: ((document.documentElement.clientWidth - 250) / 2),
  sidebarSize: 250
});

const uiReducer = handleActions({
  [SIDEBAR_TOGGLE]: (state) => {
    const sidebarSize = !state.get('sidebarVisible') ? 250 : 0;
    return state.merge({ sidebarVisible: !state.get('sidebarVisible'), sidebarSize });
  },
  [PANE_TOGGLE]: (state) => {
    // this logic is not exactly right... but it is working kinda
    const paneSize = !state.get('paneVisible') ? 0 : 100 + '%';
    return state.merge({ paneVisible: !state.get('paneVisible'), paneSize });
  },
  [PANE_RESIZE]: (state, { payload }) => (state.set('paneSize', payload)),
  [SIDEBAR_RESIZE]: (state, { payload }) => (state.set('sidebarSize', payload))
}, initialState);
export default uiReducer;
