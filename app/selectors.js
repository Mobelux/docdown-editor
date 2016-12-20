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
    const anchor = file.get('anchor', 0);
    const focus = file.get('focus', 0);
    const raw = file.get('contents', '');
    const rendered = md.render(raw);
    return Map({
      id,
      path,
      anchor,
      focus,
      raw,
      rendered
    });
  }
);
