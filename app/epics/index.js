import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/bufferTime';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/takeUntil';
import fs from 'fs';
import { ipcRenderer as ipc } from 'electron';
import { combineEpics } from 'redux-observable';
import closeFileEpic from './closeFileEpic';
import readFileEpic from './readFileEpic';
import saveFileEpic from './saveFileEpic';
import writeFileEpic from './writeFileEpic';

export default (action$, store) => combineEpics(
  closeFileEpic,
  readFileEpic,
  saveFileEpic,
  writeFileEpic
)(action$, { store, fs, ipc });
