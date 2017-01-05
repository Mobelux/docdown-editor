import React, { PropTypes } from 'react';
import { pure } from 'recompose';

const MarkdownPreview = ({ visible, content }) => {
  if (!visible) {
    return null;
  }

  return (
    <div>
      <div className="vh-100 pa4 overflow-auto rendered" dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
};

MarkdownPreview.propTypes = {
  content: PropTypes.string,
  visible: PropTypes.bool
};

export default pure(MarkdownPreview);
