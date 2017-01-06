import React, { PropTypes } from 'react';
import FileTree from '../containers/FileTree';

const Sidebar = ({ visible }) => {
  if (!visible) {
    return null;
  }

  return (
    <div className="sidebar">
      <FileTree />
    </div>
  );
};

Sidebar.propTypes = {
  visible: PropTypes.bool
};

export default Sidebar;
