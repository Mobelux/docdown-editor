import React, { PropTypes } from 'react';

const MarkdownRendered = ({ content }) => (
  <div className="vh-100 overflow-auto rendered pa4" dangerouslySetInnerHTML={{ __html: content }} />
);

MarkdownRendered.propTypes = {
  content: PropTypes.string
};
export default MarkdownRendered;
