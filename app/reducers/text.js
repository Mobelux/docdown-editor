import { Map } from 'immutable';
import { handleActions } from 'redux-actions';
import { TEXT_UPDATE } from '../actions/text';

const initialState = Map({
  raw: '',
  rendered: 'Rendered Markdown Goes Here'
});

const textReducer = handleActions({
  [TEXT_UPDATE]: (state, { text }) => state.set('raw', text)
}, initialState);
export default textReducer;
