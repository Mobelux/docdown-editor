import React, { PropTypes } from 'react';

class MarkdownRendered extends React.PureComponent {
  static propTypes = {
    content: PropTypes.string,
    visible: PropTypes.bool
  }

  render() {
    const { visible, content } = this.props;

    if (!visible) {
      return null;
    }

    return (
      <div>
        <div className="vh-100 overflow-auto rendered pa4" dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    );
  }
}

export default MarkdownRendered;
