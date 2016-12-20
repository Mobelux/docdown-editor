import fs from 'fs';
import { ipcRenderer } from 'electron';
import { Map } from 'immutable';
import { handleActions } from 'redux-actions';
import uuid from 'uuid/v4';
import {
  FOLDER_OPEN, FILE_NEW, FILE_OPEN, FILE_CLOSE, FILE_SELECT,
  FILE_SAVE, FILE_SAVE_AS, FILE_UPDATE, FILE_SELECTION, FILE_DISCARD
} from '../actions/files';
import { REPLACER_REPLACE, REPLACER_REPLACE_ALL } from '../actions/replacer';

const initialState = Map({
  folder: null,
  files: Map({}),
  paths: Map({}),
  currentFile: null
});

function getCurrentFile(state) {
  const id = state.get('currentFile');
  return state.getIn(['files', id]);
}

const filesReducer = handleActions({
  [FOLDER_OPEN]: (state, { payload }) => {
    const { path } = payload;
    return state.set('folder', path);
  },
  [FILE_NEW]: (state) => {
    const id = uuid();
    let files = state.get('files');
    const file = Map({
      id,
      name: 'Untitled',
      path: null,
      contents: '',
      changed: false,
      anchor: 0,
      focus: 0
    });
    files = files.set(id, file);
    return state.merge({ currentFile: id, files });
  },
  [FILE_OPEN]: (state, { payload }) => {
    const { path } = payload;
    const pieces = path.split('/');
    const name = pieces[pieces.length - 1];
    let paths = state.get('paths');
    let files = state.get('files');
    let file = getCurrentFile(state);
    let id;
    if (files.size === 1 && !file.get('path') && file.get('contents') === '') {
      file = file.merge({
        name,
        path,
        contents: fs.readFileSync(path, 'utf8'),
        changed: false
      });
      id = file.get('id');
    } else {
      id = state.getIn(['paths', path], uuid());
      file = state.getIn(['files', id], Map({
        id,
        name,
        path,
        contents: fs.readFileSync(path, 'utf8'),
        changed: false,
        anchor: 0,
        focus: 0
      }));
    }
    paths = paths.set(path, id);
    files = files.set(id, file);
    return state.merge({ currentFile: id, files, paths });
  },
  [FILE_CLOSE]: (state, { payload }) => {
    let { id } = payload;
    if (!id) {
      id = state.get('currentFile');
    }
    const files = state.get('files');
    const paths = state.get('paths');
    const file = files.get(id);
    if (file.get('changed')) {
      ipcRenderer.send('close-unsaved', id, file.get('path'));
      return state;
    }
    let currentFile = state.get('currentFile');
    if (id === currentFile) {
      const otherFile = files.filter(f => f.get('id') !== id).last();
      if (otherFile) {
        currentFile = otherFile.get('id');
      } else {
        currentFile = null;
      }
    }
    return state.merge({ currentFile, files: files.delete(id), paths: paths.delete(file.get('path')) });
  },
  [FILE_DISCARD]: (state, { payload }) => {
    const { id } = payload;
    const files = state.get('files');
    const paths = state.get('paths');
    const file = files.get(id);
    let currentFile = state.get('currentFile');
    if (id === currentFile) {
      const otherFile = files.filter(f => f.get('id') !== id).last();
      if (otherFile) {
        currentFile = otherFile.get('id');
      } else {
        currentFile = null;
      }
    }
    return state.merge({ currentFile, files: files.delete(id), paths: paths.delete(file.get('path')) });
  },
  [FILE_SELECT]: (state, { payload }) => {
    const { id } = payload;
    return state.set('currentFile', id);
  },
  [FILE_UPDATE]: (state, { payload }) => {
    const { text } = payload;
    const id = state.get('currentFile', uuid());
    let file = state.getIn(['files', id], Map({}));
    file = file.merge({
      contents: text || '',
      changed: (file.get('changed') || file.get('contents') !== text)
    });
    return state.setIn(['files', id], file);
  },
  [FILE_SELECTION]: (state, { payload }) => {
    const { selection } = payload;
    const id = state.get('currentFile', uuid());
    let file = state.getIn(['files', id], Map({}));
    file = file.merge({
      anchor: selection.getAnchorOffset(),
      focus: selection.getFocusOffset()
    });
    return state.setIn(['files', id], file);
  },
  [FILE_SAVE]: (state, { payload }) => {
    let { id } = payload;
    if (!id) {
      id = state.get('currentFile');
    }
    let file = state.getIn(['files', id]);
    if (!file.get('path')) {
      ipcRenderer.send('save-as', id);
      return state;
    }
    fs.writeFileSync(file.get('path'), file.get('contents'));
    file = file.set('changed', false);
    return state.setIn(['files', id], file);
  },
  [FILE_SAVE_AS]: (state, { payload }) => {
    const { id, path } = payload;
    const pieces = path.split('/');
    const name = pieces[pieces.length - 1];
    let file = state.getIn(['files', id]);
    let paths = state.get('paths');
    file = file.merge({ path, name });
    paths = paths.set(path, id);
    fs.writeFileSync(path, file.get('contents'));
    file = file.set('changed', false);
    return state.setIn(['files', id], file).set('paths', paths);
  },
  [REPLACER_REPLACE]: (state, { payload }) => {
    const { find, replace } = payload;
    const id = state.get('currentFile');
    let file = state.getIn(['files', id], Map({}));
    file = file.merge({
      contents: file.get('contents').replace(find, replace),
      changed: true
    });
    return state.setIn(['files', id], file);
  },
  [REPLACER_REPLACE_ALL]: (state, { payload }) => {
    const { find, replace } = payload;
    const id = state.get('currentFile');
    let file = state.getIn(['files', id], Map({}));
    file = file.merge({
      contents: file.get('contents').replace(new RegExp(find, 'g'), replace),
      changed: true
    });
    return state.setIn(['files', id], file);
  }
}, initialState);

export default filesReducer;
