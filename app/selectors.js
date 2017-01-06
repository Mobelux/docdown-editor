import { createSelector } from 'reselect';
import { Map, OrderedMap } from 'immutable';
import md from './utils/docdown-renderer';
import { isPreviewableFile } from './utils/file-types';

export const getFiles = state => state.files;
export const getFolder = state => state.folder;

export const getCurrentFile = createSelector(
  getFiles,
  (files) => {
    const id = files.get('currentFile');
    const file = files.getIn(['files', id], Map({}));
    const name = file.get('name');
    const path = file.get('path');
    const anchor = file.get('anchor', 0);
    const focus = file.get('focus', 0);
    const raw = file.get('contents', '');
    const rendered = isPreviewableFile(name) ? md.render(raw) : '';
    return Map({
      id,
      name,
      path,
      anchor,
      focus,
      raw,
      rendered
    });
  }
);

function folderFirstMapper(f, key) {
  const pieces = key.split('/');
  const filename = pieces[pieces.length - 1];
  const folder = pieces.slice(0, pieces.length - 1).join('/');
  const prefix = f ? '' : '_';
  return `${folder}/${prefix}-${filename}`;
}

export const getFiletree = createSelector(
  getFolder,
  (folder) => {
    const path = folder.get('folder');
    const files = folder.get('files');
    if (!path || files.size === 0) {
      return OrderedMap({});
    }
    const folderPieces = path.split('/');
    const folderName = folderPieces[folderPieces.length - 1];
    const basePath = path.replace(folderName, '');
    const tree = files.sortBy(folderFirstMapper).reduce((acc, f, p) => {
      const pieces = p.replace(basePath, '').split('/');
      let value = p;
      if (f) {
        value = OrderedMap({});
      }
      return acc.setIn(pieces, value);
    }, OrderedMap({}));
    return tree.get(folderName);
  }
);
