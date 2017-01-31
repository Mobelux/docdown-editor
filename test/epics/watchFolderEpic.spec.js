/* global jest, describe, it, expect */
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/bufferTime';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Observable';
import { ActionsObservable } from 'redux-observable';
import watchFolderEpic from '../../app/epics/watchFolderEpic';
import { FOLDER_CHANGE, openFolder } from '../../app/actions/folder';

describe('watchFolderEpic', () => {
  it('should watch folder and merge observable', () => {
    const addDirEvent = { event: 'addDir', name: '/tmp/' };
    const addEvent = { event: 'add', name: '/tmp/file.md' };
    const fileEvents = Observable.of(addDirEvent, addEvent);
    const watch = jest.fn();
    watch.mockReturnValueOnce(fileEvents);
    const action$ = ActionsObservable.of(openFolder('/tmp/'));
    watchFolderEpic(action$, { watch })
      .delay(200)
      .toPromise()
      .then((actionReceived) => {
        expect(watch.calls.length).toBeTruthy();
        expect(watch.calls[0].arguments).toEqual(['/tmp/', {
          ignorePermissionErrors: true,
          ignored: /(^|[/\\])\../
        }]);
        expect(actionReceived.type).toBe(FOLDER_CHANGE);
        expect(actionReceived.payload).toEqual([addDirEvent, addEvent]);
      });
  });
});
