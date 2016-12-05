import React from 'react';

class Tab extends React.Component {
  static propTypes = {
    // I am assuming what I need here are the ID and Name
  }

  render() {
    return (
      <div className="tabbar">
        <div className="tab">
          This is a tab
        </div>
      </div>
    );
  }
}

export default Tab;
