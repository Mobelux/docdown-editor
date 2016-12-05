import React from 'react';
import component

class Tabs extends React.Component {
  static propTypes = {
    // I am assuming what I need here are the ID and Name
  }

  render() {
    return (
      <ul className="tabs">
        <Tab />
      </ul>
    );
  }
}

export default Tab;
