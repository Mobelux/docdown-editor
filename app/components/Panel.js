import React, { PropTypes } from 'react';

const Panel = ({ children, className = '' }) => (
  <div className={`panel ${className}`}>{children}</div>
);

Panel.propTypes = {
  children: PropTypes.element,
  className: PropTypes.string
};

export default Panel;
