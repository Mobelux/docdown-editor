import React, { PropTypes } from 'react';

class Sidebar extends React.Component {
  static propTypes = {
    visible: PropTypes.bool,
    toggle: PropTypes.func
  }

  render() {
    const { visible, toggle } = this.props;

    if (visible) {
      return (
        <div className="sidebar">
          Sidebar Content
          <a href="#toggle" onClick={toggle}>x</a>
        </div>
      );
    }
    return (
      <div className="arrow-right" onClick={toggle} />
    );
  }
}

export default Sidebar;
