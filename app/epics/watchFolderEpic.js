import { combineEpics } from 'redux-observable';
import { Observable } from 'rxjs';
import { watchRx } from 'watch-rx';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/mergeMap';
import { FOLDER_OPEN, FOLDER_CLOSE, closeFolder, addFolder, removeFolder } from '../actions/folder';

let subscription;

const watchOptions = {
  ignorePermissionErrors: true,
  ignored: /(^|[\/\\])\../
};

const watchFolderEpic = action$ =>
  action$.ofType(FOLDER_OPEN)
    .mergeMap(({ payload }) => {
      const { path } = payload;

      if (subscription) {
        subscription = null;
      }

      subscription = watchRx(path, watchOptions)
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
        );

      return subscription;
    });

const unwatchFolderEpic = action$ =>
  action$.ofType(FOLDER_CLOSE)
    .filter(() => {
      subscription = null;
      return false;
    });

export default combineEpics(watchFolderEpic, unwatchFolderEpic);
