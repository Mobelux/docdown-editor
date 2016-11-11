import React, { PropTypes } from 'react';

const MarkdownRendered = ({ content }) => (
  <div className="flex-1-50 overflow-auto rendered" dangerouslySetInnerHTML={{ __html: content }} />
);

MarkdownRendered.propTypes = {
  content: PropTypes.string
};
export default MarkdownRendered;
