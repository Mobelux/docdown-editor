import { Map } from 'immutable';
import { handleActions } from 'redux-actions';
import md from 'docdown/renderer';
import { TEXT_UPDATE } from '../actions/text';

const initialState = Map({
  raw: '',
  rendered: ''
});

const textReducer = handleActions({
  [TEXT_UPDATE]: (state, { payload }) => {
    const { text } = payload;
    return state.merge({ raw: text, rendered: md.render(text) });
  }
}, initialState);
export default textReducer;
