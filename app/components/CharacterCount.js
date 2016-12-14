import React, { PropTypes } from 'react';

const CharacterCount = ({ text, visible }) => {
  if (!visible) {
    return null;
  }
  const count = text.replace(/\s/g, '').length.toLocaleString('en-US');
  return (
    <div className="character-count">{count} chars</div>
  );
};
CharacterCount.propTypes = {
  text: PropTypes.string.isRequired,
  visible: PropTypes.bool.isRequired
};
export default CharacterCount;
