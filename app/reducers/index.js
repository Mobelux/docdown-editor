import { combineReducers } from 'redux';
import files from './files';
import text from './text';
import ui from './ui';

const rootReducer = combineReducers({
  files,
  text,
  ui
});

export default rootReducer;
