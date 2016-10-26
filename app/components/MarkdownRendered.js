import React, { PropTypes } from 'react';

const MarkdownRendered = ({ content }) => (
  <div className="flex-1-50">{content}</div>
);

MarkdownRendered.propTypes = {
  content: PropTypes.string
}
export default MarkdownRendered;
