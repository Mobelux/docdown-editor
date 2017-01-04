/* eslint-disable no-unused-expressions */
import expect from 'expect';
import * as actions from '../../app/actions/files';

describe('files actions', () => {
  it('should openFolder should create FOLDER_OPEN action', () => {
    expect(actions.openFolder('/dev/null')).toEqual({
      type: actions.FOLDER_OPEN,
      payload: { path: '/dev/null' }
    });
  });

  it('should newFile should create FILE_NEW action', () => {
    expect(actions.newFile()).toEqual({ type: actions.FILE_NEW });
  });

  it('should openFile should create FILE_OPEN action', () => {
    expect(actions.openFile('/tmp/filename.md')).toEqual({
      type: actions.FILE_OPEN,
      payload: { path: '/tmp/filename.md' }
    });
  });

  it('should closeFile should create FILE_CLOSE action', () => {
    expect(actions.closeFile('1234')).toEqual({
      type: actions.FILE_CLOSE,
      payload: { id: '1234' }
    });
  });

  it('should selectFile should create FILE_SELECT action', () => {
    expect(actions.selectFile('2334')).toEqual({
      type: actions.FILE_SELECT,
      payload: { id: '2334' }
    });
  });

  it('should saveFile should create FILE_SAVE action', () => {
    expect(actions.saveFile('453')).toEqual({
      type: actions.FILE_SAVE,
      payload: { id: '453' }
    });
  });

  it('should saveAsFile should create FILE_SAVE_AS action', () => {
    expect(actions.saveAsFile('111', '/tmp/file.txt')).toEqual({
      type: actions.FILE_SAVE_AS,
      payload: { id: '111', path: '/tmp/file.txt' }
    });
  });

  it('should updateFile should create FILE_UPDATE action', () => {
    expect(actions.updateFile('A story of a man')).toEqual({
      type: actions.FILE_UPDATE,
      payload: { text: 'A story of a man' }
    });
  });

  it('should updateSelection should create FILE_SELECTION action', () => {
    expect(actions.updateSelection({ anchor: 163, focus: 165 })).toEqual({
      type: actions.FILE_SELECTION,
      payload: { selection: { anchor: 163, focus: 165 } }
    });
  });

  it('should discardFile should create FILE_DISCARD action', () => {
    expect(actions.discardFile('873')).toEqual({
      type: actions.FILE_DISCARD,
      payload: { id: '873' }
    });
  });
});
