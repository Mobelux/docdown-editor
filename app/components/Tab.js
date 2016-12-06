import React, { PropTypes } from 'react';

// will probably need an onClick to close and a way to indicate Changed=true in future
// need to do somethign with that onTabClick so it gets the id
const Tab = ({ id, name, changed, onTabClick }) => (
  <li>
    <a href={`#${name}`} onClick={() => onTabClick(id)}>
      <span>{name}</span>
    </a>
  </li>
);

Tab.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  changed: PropTypes.bool,
  onTabClick: PropTypes.func
};

export default Tab;
