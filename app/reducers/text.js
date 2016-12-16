/* global document */
import { Map } from 'immutable';
import { handleActions } from 'redux-actions';
import { TEXT_FIND, TEXT_REPLACE, TEXT_REPLACE_ALL, TEXT_CLEAR } from '../actions/text';
import { FOLDER_OPEN, FILE_NEW, FILE_OPEN, FILE_CLOSE, FILE_SELECT } from '../actions/files';

const initialState = Map({
  find: null,
  replace: null,
  count: 0,
  update: false
});

const textReducer = handleActions({
  [TEXT_FIND]: (state, { payload }) => {
    const { find } = payload;
    if (find === state.get('find')) {
      return state.merge({ count: state.get('count') + 1, update: false });
    }
    return state.merge({ find, replace: null, count: 1, update: false });
  },
  [TEXT_REPLACE]: (state, { payload }) => {
    const { find, replace } = payload;

    if (find === state.get('find') && replace === state.get('replace')) {
      return state.merge({ count: state.get('count') + 1, update: true });
    }
    return state.merge({ find, replace, count: 1, update: true });
  },
  [TEXT_REPLACE_ALL]: (state, { payload }) => {
    const { find, replace } = payload;

    if (find === state.get('find') && replace === state.get('replace')) {
      return state.merge({ count: 0, update: true });
    }
    return state.merge({ find, replace, count: 0, update: true });
  },
  [TEXT_CLEAR]: () => (initialState),
  [FOLDER_OPEN]: () => (initialState),
  [FILE_NEW]: () => (initialState),
  [FILE_OPEN]: () => (initialState),
  [FILE_CLOSE]: () => (initialState),
  [FILE_SELECT]: () => (initialState)
}, initialState);
export default textReducer;
