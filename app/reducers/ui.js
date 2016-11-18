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
    // this logic is wrong for the default state - removing the right element but makign width of pane 1 0
    const paneSize = !state.get('paneSize') ? (document.getElementById('split-pane-wrapper') / 2) : 0;
    return state.merge({ paneVisible: !state.get('paneVisible'), paneSize });
  },
  [PANE_RESIZE]: (state, { payload }) => (state.set('paneSize', payload)),
  [SIDEBAR_RESIZE]: (state, { payload }) => (state.set('sidebarSize', payload))
}, initialState);
export default uiReducer;
