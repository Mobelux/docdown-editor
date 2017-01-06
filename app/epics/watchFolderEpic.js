import { watchRx } from 'watch-rx';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/takeUntil';
import { FOLDER_OPEN, FOLDER_CLOSE, changeFolder, closeFolder } from '../actions/folder';

const watchOptions = {
  ignorePermissionErrors: true,
  ignored: /(^|[/\\])\../
};

const watchFolderEpic = action$ =>
  action$.ofType(FOLDER_OPEN)
    .mergeMap(({ payload }) => {
      const { path } = payload;

      return watchRx(path, watchOptions)
        .filter(file => file.event !== 'change')
        .map(
          file => changeFolder(file),
          err => closeFolder(err),
          () => closeFolder()
        ).takeUntil(action$.ofType(FOLDER_OPEN, FOLDER_CLOSE));
    });

export default watchFolderEpic;
