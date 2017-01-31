/* global describe, it, expect */
/* eslint-disable no-unused-expressions */
import * as actions from '../../app/actions/replacer';

describe('replacer actions', () => {
  it('should findText should create REPLACER_FIND action', () => {
    expect(actions.findText('thing')).toEqual({ type: actions.REPLACER_FIND, payload: { find: 'thing' } });
  });

  it('should replaceText should create REPLACER_REPLACE action', () => {
    expect(actions.replaceText('this', 'that')).toEqual({
      type: actions.REPLACER_REPLACE,
      payload: { find: 'this', replace: 'that' }
    });
  });

  it('should replaceAllText should create REPLACER_REPLACE_ALL action', () => {
    expect(actions.replaceAllText('that', 'this')).toEqual({
      type: actions.REPLACER_REPLACE_ALL,
      payload: { find: 'that', replace: 'this' }
    });
  });

  it('should clearText should create REPLACER_CLEAR action', () => {
    expect(actions.clearText()).toEqual({ type: actions.REPLACER_CLEAR });
  });
});
