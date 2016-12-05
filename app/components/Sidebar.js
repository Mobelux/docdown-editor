import React, { PropTypes } from 'react';
import FileTree from '../containers/FileTree';

class Sidebar extends React.Component {
  static propTypes = {
    visible: PropTypes.bool,
    toggle: PropTypes.func
  }

  render() {
    const { visible, toggle } = this.props;

    if (visible) {
      return (
        <div className="sidebar">
          <a href="#toggle" onClick={toggle}>x</a>
          <FileTree />
        </div>
      );
    }
    return (
      <div className="arrow arrow-right" onClick={toggle} />
    );
  }
}

export default Sidebar;
