/* global document */
import { Map } from 'immutable';
import { handleActions } from 'redux-actions';
import { SIDEBAR_TOGGLE, PANE_TOGGLE, PANE_RESIZE, SIDEBAR_RESIZE } from '../actions/ui';
import { FOLDER_OPEN } from '../actions/files';


const initialState = Map({
  sidebarVisible: false,
  paneVisible: true,
  paneSize: (document.documentElement.clientWidth / 2),
  sidebarSize: 250
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
  [FOLDER_OPEN]: state => (state.set('sidebarVisible', true)),
  [PANE_TOGGLE]: state => (state.set('paneVisible', !state.get('paneVisible'))),
  [PANE_RESIZE]: (state, { payload }) => (state.set('paneSize', payload)),
  [SIDEBAR_RESIZE]: (state, { payload }) => (state.set('sidebarSize', payload))
}, initialState);
export default uiReducer;
