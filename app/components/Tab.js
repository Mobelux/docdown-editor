import React, { PropTypes } from 'react';
import cx from 'classnames';

// will probably need an onClick to close and a way to indicate Changed=true in future
// need to do somethign with that onTabClick so it gets the id
const Tab = ({ id, name, changed, isActive, onTabClick, onRemoveTab }) => (
  <li
    className={cx('tabs__item', { 'is-active': isActive })}
  >
    <a href={`#${name}`} onClick={() => onTabClick(id)}>
      <span>{name}</span>
    </a>
    <button onClick={() => onRemoveTab(id)}>x</button>
  </li>
);

Tab.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  changed: PropTypes.bool,
  isActive: PropTypes.bool,
  onTabClick: PropTypes.func,
  onRemoveTab: PropTypes.func
};

export default Tab;
