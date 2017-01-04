import fs from 'fs';
import { Map } from 'immutable';
import { handleActions } from 'redux-actions';
import {
  FILE_NEW, FILE_OPEN, FILE_SAVE, FILE_SAVE_AS, FILE_UPDATE, FILE_SELECTION
} from '../actions/files';
import { REPLACER_FIND, REPLACER_REPLACE, REPLACER_REPLACE_ALL } from '../actions/replacer';

const initialState = Map({
  name: 'Untitled',
  path: null,
  contents: '',
  changed: false,
  anchor: 0,
  focus: 0
});

const fileReducer = handleActions({
  [FILE_NEW]: () => initialState,
  [FILE_OPEN]: (file, { payload }) => {
    const { path } = payload;
    const pieces = path.split('/');
    const name = pieces[pieces.length - 1];
    return file.merge({
      name,
      path,
      contents: fs.readFileSync(path, 'utf8'),
      changed: false,
      anchor: 0,
      focus: 0
    });
  },
  [FILE_SAVE]: file => file.set('changed', false),
  [FILE_SAVE_AS]: (file, { payload }) => {
    const { path } = payload;
    const pieces = path.split('/');
    const name = pieces[pieces.length - 1];
    return file.merge({ path, name, changed: false });
  },
  [FILE_UPDATE]: (file, { payload }) => {
    const { text } = payload;
    return file.merge({
      contents: text || '',
      changed: (file.get('changed') || file.get('contents') !== text)
    });
  },
  [FILE_SELECTION]: (file, { payload }) => {
    const { selection } = payload;
    return file.merge({
      anchor: selection.getAnchorOffset(),
      focus: selection.getFocusOffset()
    });
  },
  [REPLACER_FIND]: (file, { payload }) => {
    const { find } = payload;
    const contents = file.get('contents');
    const anchor = file.get('anchor');
    const focus = file.get('focus');
    const from = Math.max.apply(Math, [anchor, focus]);
    const next = contents.indexOf(find, from);
    if (next === -1) {
      return file;
    }
    return file.merge({
      anchor: next,
      focus: next + find.length
    });
  },
  [REPLACER_REPLACE]: (file, { payload }) => {
    const { find, replace } = payload;
    let contents = file.get('contents');
    const anchor = file.get('anchor');
    const focus = file.get('focus');
    const from = Math.max.apply(Math, [anchor, focus]);
    const next = contents.indexOf(find, from);
    if (next === -1) {
      return file;
    }
    contents = contents.slice(0, next) + replace + contents.slice(next + find.length);
    return file.merge({
      contents,
      anchor: next,
      focus: next + replace.length,
      changed: true
    });
  },
  [REPLACER_REPLACE_ALL]: (file, { payload }) => {
    const { find, replace } = payload;
    return file.merge({
      contents: file.get('contents').replace(new RegExp(find, 'g'), replace),
      changed: true
    });
  }
}, initialState);

export default fileReducer;
