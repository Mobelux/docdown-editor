import fs from 'fs';
import 'rxjs/add/operator/map';
import { FILE_SAVE_CONFIRMED, FILE_SAVE_AS, writeFile } from '../actions/files';

const writeFileEpic = (action$, store) =>
  action$.ofType(FILE_SAVE_CONFIRMED, FILE_SAVE_AS)
    .map(({ payload }) => {
      const { files } = store.getState();
      const { id } = payload;
      const file = files.getIn(['files', id]);
      fs.writeFile(file.get('path'), file.get('contents'));
      return writeFile(id);
    });

export default writeFileEpic;
