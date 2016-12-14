/* global document */
import { Map } from 'immutable';
import { handleActions } from 'redux-actions';
import { SIDEBAR_TOGGLE, PANE_TOGGLE, PANE_RESIZE, SIDEBAR_RESIZE } from '../actions/ui';
import { FOLDER_OPEN } from '../actions/files';


const initialState = Map({
  sidebarVisible: false,
  paneVisible: true,
  paneSize: ((document.documentElement.clientWidth - 250) / 2),
  sidebarSize: 250
});

const uiReducer = handleActions({
  [SIDEBAR_TOGGLE]: state => (state.set('sidebarVisible', !state.get('sidebarVisible'))),
  [FOLDER_OPEN]: state => (state.set('sidebarVisible', true)),
  [PANE_TOGGLE]: state => (state.set('paneVisible', !state.get('paneVisible'))),
  [PANE_RESIZE]: (state, { payload }) => (state.set('paneSize', payload)),
  [SIDEBAR_RESIZE]: (state, { payload }) => (state.set('sidebarSize', payload))
}, initialState);
export default uiReducer;
