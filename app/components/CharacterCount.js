import React, { PropTypes } from 'react';

const CharacterCount = ({ text, className = '' }) => {
  const count = text.replace(/\s/g, '').length.toLocaleString('en-US');
  return (
    <div className={`character-count ${className}`}>{count} chars</div>
  );
};
CharacterCount.propTypes = {
  text: PropTypes.string.isRequired,
  className: PropTypes.string
};
export default CharacterCount;
