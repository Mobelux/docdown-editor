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
  [SIDEBAR_TOGGLE]: state => (state.set('sidebarVisible', !state.get('sidebarVisible'))),
  [PANE_TOGGLE]: state => (state.set('paneVisible', !state.get('paneVisible'))),
  [PANE_RESIZE]: (state, { payload }) => (state.set('paneSize', payload)),
  [SIDEBAR_RESIZE]: (state, { payload }) => (state.set('sidebarSize', payload))
}, initialState);
export default uiReducer;
