/* global describe, it, expect */
/* eslint-disable no-unused-expressions */
import * as actions from '../../app/actions/ui';

describe('ui actions', () => {
  it('should toggleSidebar should create SIDEBAR_TOGGLE action', () => {
    expect(actions.toggleSidebar()).toEqual({ type: actions.SIDEBAR_TOGGLE });
  });

  it('should togglePane should create PANE_TOGGLE action', () => {
    expect(actions.togglePane()).toEqual({ type: actions.PANE_TOGGLE });
  });

  it('should toggleCount should create COUNT_TOGGLE action', () => {
    expect(actions.toggleCount()).toEqual({ type: actions.COUNT_TOGGLE });
  });

  it('should resizePane should create PANE_RESIZE action', () => {
    expect(actions.resizePane(150)).toEqual({ type: actions.PANE_RESIZE, payload: 150 });
  });

  it('should resizeSidebar should create SIDEBAR_RESIZE action', () => {
    expect(actions.resizeSidebar(250)).toEqual({ type: actions.SIDEBAR_RESIZE, payload: 250 });
  });

  it('should increaseFontSize should create FONT_SIZE_INCREASE action', () => {
    expect(actions.increaseFontSize()).toEqual({ type: actions.FONT_SIZE_INCREASE });
  });

  it('should decreaseFontSize should create FONT_SIZE_DECREASE action', () => {
    expect(actions.decreaseFontSize()).toEqual({ type: actions.FONT_SIZE_DECREASE });
  });

  it('should resetFontSize should create FONT_SIZE_RESET action', () => {
    expect(actions.resetFontSize()).toEqual({ type: actions.FONT_SIZE_RESET });
  });
});
