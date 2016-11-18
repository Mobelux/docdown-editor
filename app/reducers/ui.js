/* global document */
import { Map } from 'immutable';
import { handleActions } from 'redux-actions';
import { SIDEBAR_TOGGLE, PANE_RESIZE } from '../actions/ui';


const initialState = Map({
  sidebarVisible: true,
  paneSize: ((document.documentElement.clientWidth - 250) / 2)
});

const uiReducer = handleActions({
  [SIDEBAR_TOGGLE]: (state, { payload }) => (state.set('sidebarVisible', payload)),
  [PANE_RESIZE]: (state, { payload }) => (state.set('paneSize', payload))
}, initialState);
export default uiReducer;
