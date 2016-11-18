import React, { PropTypes } from 'react';

class MarkdownRendered extends React.Component {
  static propTypes = {
    content: PropTypes.string,
    visible: PropTypes.bool,
    toggle: PropTypes.func
  }

  render() {
    const { visible, toggle, content } = this.props;

    if (visible) {
      return (
        <div>
          <a href="#toggle" onClick={toggle}>X</a>
          <div className="vh-100 overflow-auto rendered pa4" dangerouslySetInnerHTML={{ __html: content }} />
        </div>
      );
    }
    return null;
  }
}


export default MarkdownRendered;
