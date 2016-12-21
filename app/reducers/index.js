import { combineReducers } from 'redux';
import files from './files';
import replacer from './replacer';
import ui from './ui';

const rootReducer = combineReducers({
  files,
  replacer,
  ui
});

export default rootReducer;
