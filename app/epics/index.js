import { combineEpics } from 'redux-observable';
import closeFileEpic from './closeFileEpic';
import readFileEpic from './readFileEpic';
import saveFileEpic from './saveFileEpic';
import writeFileEpic from './writeFileEpic';
import watchFolderEpic from './watchFolderEpic';

export default combineEpics(
  closeFileEpic,
  readFileEpic,
  saveFileEpic,
  writeFileEpic,
  watchFolderEpic
);
