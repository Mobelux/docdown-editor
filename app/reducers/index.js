import { combineReducers } from 'redux';
import text from './text';
import ui from './ui';

const rootReducer = combineReducers({
  text,
  ui
});

export default rootReducer;
