import React, { PropTypes } from 'react';

// will probably need an onClick to close and a way to indicate Changed=true in future
const Tab = ({ id, name, changed }) => (
  <li>
    <a href={`#${name}`}>
      <span>{name}</span>
    </a>
  </li>
);

Tab.propTypes = {
  id: PropTypes.number,
  name: PropTypes.string,
  changed: PropTypes.bool
};

export default Tab;
