import React, { PropTypes } from 'react';
import FileTree from '../containers/FileTree';

class Sidebar extends React.Component {
  static propTypes = {
    visible: PropTypes.bool
  }

  render() {
    if (!this.props.visible) {
      return null;
    }

    return (
      <div className="sidebar">
        <FileTree />
      </div>
    );
  }
}

export default Sidebar;
