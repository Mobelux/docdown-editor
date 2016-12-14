import React, { PropTypes } from 'react';
import { withState } from 'recompose';
import Icon from './Icon';

const Folder = ({ name, forceOpen = false, collapsed, toggleCollapsed, children }) => (
  <li>
    <a
      href={`#${name}`}
      onClick={(e) => {
        e.preventDefault();
        toggleCollapsed(n => !n);
      }}
    >
      <span><Icon name="folder" />&nbsp;{name}</span>
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
