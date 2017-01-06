import expect, { createSpy } from 'expect';
import configureStore from 'redux-mock-store';
import { Map } from 'immutable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { ActionsObservable } from 'redux-observable';
import writeFileEpic from '../../app/epics/writeFileEpic';
import { WRITE_FILE, openFile } from '../../app/actions/files';

const mockStore = configureStore([]);

describe('readFileEpic', () => {
  it('should send fs read in the file', () => {
    const store = mockStore({
      files: Map({
        files: Map({
          223: Map({
            path: '/tmp/this.md',
            contents: 'Great stuff!'
          })
        }),
        currentFile: null
      })
    });
    const fs = {
      writeFile: createSpy()
    };
    const action$ = ActionsObservable.of(openFile('/tmp/file.md'));
    writeFileEpic(action$, { store, fs })
      .toPromise()
      .then((actionReceived) => {
        expect(fs.writeFile.calls.length).toExist();
        expect(fs.writeFile.calls[0].arguments).toEqual(['/tmp/this.md', 'Great stuff!']);
        expect(actionReceived.type).toBe(WRITE_FILE);
        expect(actionReceived.payload).toEqual({ id: '223' });
      });
  });
});
