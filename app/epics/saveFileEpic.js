import { FILE_SAVE, confirmedSaveFile } from '../actions/files';

const saveFileEpic = (action$, { store, ipc }) =>
  action$.ofType(FILE_SAVE)
    .filter(({ payload }) => {
      const { id } = payload;
      const { files } = store.getState();
      const fileId = id || files.get('currentFile');
      const allFiles = files.get('files');
      const file = allFiles.get(fileId);
      if (!file.get('path')) {
        ipc.send('save-as', fileId);
        return false;
      }
      return true;
    })
    .map(({ payload }) => {
      const { id } = payload;
      const { files } = store.getState();
      const fileId = id || files.get('currentFile');
      return confirmedSaveFile(fileId);
    });

export default saveFileEpic;
