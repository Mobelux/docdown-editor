import { FILE_OPEN, readFile } from '../actions/files';

const readFileEpic = (action$, { fs }) =>
  action$.ofType(FILE_OPEN)
    .map(({ payload }) => {
      const { path } = payload;
      const contents = fs.readFileSync(path, 'utf8');
      return readFile(path, contents);
    });

export default readFileEpic;
