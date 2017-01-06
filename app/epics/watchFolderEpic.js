import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/bufferTime';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/takeUntil';
import { FOLDER_OPEN, FOLDER_CLOSE, changeFolder, closeFolder } from '../actions/folder';

const watchOptions = {
  ignorePermissionErrors: true,
  ignored: /(^|[/\\])\../
};

const watchFolderEpic = (action$, { watch }) =>
  action$.ofType(FOLDER_OPEN)
    .mergeMap(({ payload }) => {
      const { path } = payload;

      return watch(path, watchOptions)
        .filter(change => change.event !== 'change')
        .bufferTime(100)
        .filter(changes => changes.length)
        .map(
          changes => changeFolder(changes),
          err => closeFolder(err),
          () => closeFolder()
        )
        .takeUntil(action$.ofType(FOLDER_OPEN, FOLDER_CLOSE));
    });

export default watchFolderEpic;
