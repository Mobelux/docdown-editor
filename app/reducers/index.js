import { combineReducers } from 'redux';
import files from './files';
import folder from './folder';
import replacer from './replacer';
import ui from './ui';

const rootReducer = combineReducers({
  files,
  folder,
  replacer,
  ui
});

export default rootReducer;
