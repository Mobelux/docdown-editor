import React, { PropTypes } from 'react';
import { withState } from 'recompose';

const Folder = ({ name, forceOpen = false, collapsed, toggleCollapsed, children }) => (
  <li>
    <a
      href={`#${name}`}
      onClick={(e) => {
        e.preventDefault();
        toggleCollapsed(n => !n);
      }}
    >
      <span>{name}</span>
    </a>
    {(forceOpen || !collapsed) && <ul>{children}</ul>}
  </li>
);

Folder.propTypes = {
  name: PropTypes.string,
  forceOpen: PropTypes.bool,
  collapsed: PropTypes.bool,
  toggleCollapsed: PropTypes.func,
  children: PropTypes.any
};

const collapsible = withState('collapsed', 'toggleCollapsed', true);
export default collapsible(Folder);
