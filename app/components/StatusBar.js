import React, { PropTypes } from 'react';

const StatusBar = ({ visible, children, className = '' }) => {
  if (!visible) {
    return null;
  }
  return (
    <div className={`status-bar ${className}`}>{children}</div>
  );
};

StatusBar.propTypes = {
  visible: PropTypes.bool.isRequired,
  children: PropTypes.arrayOf(PropTypes.element),
  className: PropTypes.string
};

export default StatusBar;
