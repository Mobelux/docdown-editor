import { watchRx } from 'watch-rx';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/takeUntil';
import { FOLDER_OPEN, FOLDER_CLOSE, closeFolder, addFolder, removeFolder } from '../actions/folder';

const watchOptions = {
  ignorePermissionErrors: true,
  ignored: /(^|[\/\\])\../
};

const watchFolderEpic = action$ =>
  action$.ofType(FOLDER_OPEN)
    .mergeMap(({ payload }) => {
      const { path } = payload;

      return watchRx(path, watchOptions)
        .filter(file => file.event !== 'change')
        .map(
          (file) => {
            switch (file.event) {
              case 'add':
                return addFolder(file.name);
              case 'addDir':
                return addFolder(file.name, true);
              case 'unlink':
                return removeFolder(file.name);
              case 'unlinkDir':
                return removeFolder(file.name, true);
              default:
            }
          },
          err => closeFolder(err),
          () => closeFolder()
        ).takeUntil(action$.ofType(FOLDER_OPEN, FOLDER_CLOSE));
    });

export default watchFolderEpic;
