import { ipcRenderer } from 'electron';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import { FILE_CLOSE, confirmedCloseFile } from '../actions/files';

const closeFileEpic = (action$, store) =>
  action$.ofType(FILE_CLOSE)
    .filter(({ payload }) => {
      const { id } = payload;
      const { files } = store.getState();
      const fileId = id || files.get('currentFile');
      const allFiles = files.get('files');
      const file = allFiles.get(fileId);
      if (file.get('changed')) {
        ipcRenderer.send('close-unsaved', fileId, file.get('path'));
        return false;
      }
      return true;
    })
    .map(({ payload }) => {
      const { id } = payload;
      const { files } = store.getState();
      const fileId = id || files.get('currentFile');
      return confirmedCloseFile(fileId);
    });

export default closeFileEpic;
