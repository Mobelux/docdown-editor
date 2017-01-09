import expect, { createSpy } from 'expect';
import configureStore from 'redux-mock-store';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { ActionsObservable } from 'redux-observable';
import { Map } from 'immutable';
import closeFileEpic from '../../app/epics/closeFileEpic';
import { FILE_CLOSE_CONFIRMED, closeFile } from '../../app/actions/files';

const mockStore = configureStore([]);

describe('closeFileEpic', () => {
  it('should send ipc message if changed', () => {
    const store = mockStore({
      files: Map({
        files: Map({
          123: Map({
            path: '/tmp/more.txt',
            changed: true
          })
        }),
        currentFile: null
      })
    });
    const ipc = {
      send: createSpy()
    };
    const action$ = ActionsObservable.of(closeFile('123'));
    closeFileEpic(action$, { store, ipc })
      .toPromise()
      .then(() => {
        expect(ipc.send.calls.length).toExist();
        expect(ipc.send.calls[0].arguments).toEqual(['close-unsaved', '123', '/tmp/more.txt']);
      });
  });

  it('should output confirmed close action if not changed', () => {
    const store = mockStore({
      files: Map({
        files: Map({
          123: Map({
            changed: false
          })
        }),
        currentFile: null
      })
    });
    const ipc = {
      send: createSpy()
    };
    const action$ = ActionsObservable.of(closeFile('123'));
    closeFileEpic(action$, { store, ipc })
      .toPromise()
      .then((actionReceived) => {
        expect(actionReceived.type).toBe(FILE_CLOSE_CONFIRMED);
        expect(actionReceived.payload).toEqual({ id: '123' });
      });
    expect(ipc.send.calls.length).toNotExist();
  });
});
