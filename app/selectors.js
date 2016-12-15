import { createSelector } from 'reselect';
import { Map } from 'immutable';
import md from './utils/docdown-renderer';

export const getFiles = state => state.files;

export const getCurrentFile = createSelector(
  getFiles,
  (files) => {
    const id = files.get('currentFile');
    const file = files.getIn(['files', id], Map({}));
    const path = file.get('path');
    const raw = file.get('contents', '');
    return Map({
      id,
      path,
      raw,
      rendered: md.render(raw)
    });
  }
);
