/* global jest, describe, it, expect */
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { ActionsObservable } from 'redux-observable';
import readFileEpic from '../../app/epics/readFileEpic';
import { FILE_READ, openFile } from '../../app/actions/files';

describe('readFileEpic', () => {
  it('should send fs read in the file', () => {
    const fs = {
      readFileSync: jest.fn()
    };
    fs.readFileSync.mockReturnValueOnce('Example file!');
    const action$ = ActionsObservable.of(openFile('/tmp/file.md'));
    readFileEpic(action$, { fs })
      .toPromise()
      .then((actionReceived) => {
        expect(fs.readFileSync.mock.calls.length).toBeTruthy();
        expect(fs.readFileSync.mock.calls[0].arguments).toEqual(['/tmp/file.md', 'utf8']);
        expect(actionReceived.type).toBe(FILE_READ);
        expect(actionReceived.payload).toEqual({
          path: '/tmp/file.md',
          contents: 'Example file!'
        });
      });
  });
});
