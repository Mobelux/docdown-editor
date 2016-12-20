import React, { PropTypes } from 'react';
import cx from 'classnames';

const Tab = ({ id, name, changed, isActive, onTabClick, onRemoveTab }) => (
  <li
    className={cx('tabs__item', { 'is-active': isActive, 'is-changed': changed })}
  >
    <a href={`#${name}`} onClick={() => onTabClick(id)}>
      <span>{name}</span>
    </a>
    <button className="tabs__item--close" onClick={() => onRemoveTab(id)} />
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
