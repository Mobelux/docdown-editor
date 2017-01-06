import expect from 'expect';
import expectImmutable from 'expect-immutable';
import { Map } from 'immutable';
import uiReducer from '../../app/reducers/ui';
import {
  SIDEBAR_TOGGLE, PANE_TOGGLE, COUNT_TOGGLE, PANE_RESIZE, SIDEBAR_RESIZE,
  FONT_SIZE_INCREASE, FONT_SIZE_DECREASE, FONT_SIZE_RESET
} from '../../app/actions/ui';
import { FOLDER_OPEN } from '../../app/actions/files';

expect.extend(expectImmutable);

describe('ui reducer', () => {
  it('should handle initial state', () => {
    const initial = Map({
      sidebarVisible: false,
      paneVisible: true,
      countVisible: true,
      paneSize: 512,
      sidebarSize: 250,
      fontSize: 90
    });
    expect(uiReducer(undefined, { type: 'SOMETHING ELSE' })).toEqualImmutable(initial);
  });

  it('should handle SIDEBAR_TOGGLE', () => {
    const start = Map({
      sidebarVisible: false,
      paneSize: 512,
      sidebarSize: 250
    });
    const end = Map({
      sidebarVisible: true,
      paneSize: 387,
      sidebarSize: 250
    });
    expect(uiReducer(start, { type: SIDEBAR_TOGGLE })).toEqualImmutable(end);
    expect(uiReducer(end, { type: SIDEBAR_TOGGLE })).toEqualImmutable(start);
  });

  it('should handle PANE_TOGGLE', () => {
    const start = Map({
      paneVisible: true
    });
    const end = Map({
      paneVisible: false
    });
    expect(uiReducer(start, { type: PANE_TOGGLE })).toEqualImmutable(end);
    expect(uiReducer(end, { type: PANE_TOGGLE })).toEqualImmutable(start);
  });

  it('should handle COUNT_TOGGLE', () => {
    const start = Map({
      countVisible: true
    });
    const end = Map({
      countVisible: false
    });
    expect(uiReducer(start, { type: COUNT_TOGGLE })).toEqualImmutable(end);
    expect(uiReducer(end, { type: COUNT_TOGGLE })).toEqualImmutable(start);
  });

  it('should handle FOLDER_OPEN', () => {
    const start = Map({
      sidebarVisible: false
    });
    const end = Map({
      sidebarVisible: true
    });
    expect(uiReducer(start, { type: FOLDER_OPEN })).toEqualImmutable(end);
    expect(uiReducer(end, { type: FOLDER_OPEN })).toEqualImmutable(end);
  });

  it('should handle PANE_RESIZE', () => {
    const start = Map({
      paneSize: 512
    });
    const end = Map({
      paneSize: 712
    });
    expect(uiReducer(start, { type: PANE_RESIZE, payload: 712 })).toEqualImmutable(end);
  });

  it('should handle SIDEBAR_RESIZE', () => {
    const start = Map({
      sidebarSize: 250
    });
    const end = Map({
      sidebarSize: 346
    });
    expect(uiReducer(start, { type: SIDEBAR_RESIZE, payload: 346 })).toEqualImmutable(end);
  });

  it('should handle FONT_SIZE_INCREASE', () => {
    const start = Map({
      fontSize: 190
    });
    const end = Map({
      fontSize: 200
    });
    expect(uiReducer(start, { type: FONT_SIZE_INCREASE })).toEqualImmutable(end);
    expect(uiReducer(end, { type: FONT_SIZE_INCREASE })).toEqualImmutable(end);
  });

  it('should handle FONT_SIZE_DECREASE', () => {
    const start = Map({
      fontSize: 30
    });
    const end = Map({
      fontSize: 20
    });
    expect(uiReducer(start, { type: FONT_SIZE_DECREASE })).toEqualImmutable(end);
    expect(uiReducer(end, { type: FONT_SIZE_DECREASE })).toEqualImmutable(end);
  });

  it('should handle FONT_SIZE_RESET', () => {
    const start = Map({
      fontSize: 30
    });
    const end = Map({
      fontSize: 90
    });
    expect(uiReducer(start, { type: FONT_SIZE_RESET })).toEqualImmutable(end);
  });

  it('should handle unknown action type', () => {
    expect(uiReducer(Map({}), { type: 'unknown' })).toEqualImmutable(Map({}));
  });
});
