import expect, { createSpy } from 'expect';
import configureStore from 'redux-mock-store';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { ActionsObservable } from 'redux-observable';
import { Map } from 'immutable';
import saveFileEpic from '../../app/epics/saveFileEpic';
import { FILE_SAVE_CONFIRMED, saveFile } from '../../app/actions/files';

const mockStore = configureStore([]);

describe('saveFileEpic', () => {
  it('should send ipc message if changed', () => {
    const store = mockStore({
      files: Map({
        files: Map({
          323: Map({
            path: null
          })
        }),
        currentFile: 323
      })
    });
    const ipc = {
      send: createSpy()
    };
    const action$ = ActionsObservable.of(saveFile('323'));
    saveFileEpic(action$, { store, ipc })
      .toPromise()
      .then(() => {
        expect(ipc.send.calls.length).toExist();
        expect(ipc.send.calls[0].arguments).toEqual(['save-as', '323']);
      });
  });

  it('should output confirmed close action if not changed', () => {
    const store = mockStore({
      files: Map({
        files: Map({
          423: Map({
            path: '/tmp/other.md'
          })
        }),
        currentFile: null
      })
    });
    const ipc = {
      send: createSpy()
    };
    const action$ = ActionsObservable.of(saveFile('423'));
    saveFileEpic(action$, { store, ipc })
      .toPromise()
      .then((actionReceived) => {
        expect(actionReceived.type).toBe(FILE_SAVE_CONFIRMED);
        expect(actionReceived.payload).toEqual({ id: '423' });
      });
    expect(ipc.send.calls.length).toNotExist();
  });
});
