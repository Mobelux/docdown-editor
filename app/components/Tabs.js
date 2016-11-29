import React, { PropTypes } from 'react';

class Tabs extends React.Component {
  static PropTypes = {
    children: PropTypes.object
  }

  render() {
    const { children } = this.props;

    return (
      <div>
        <ol
          className="tabs-list"
        >
        // will need logic here to add/remove lis for tabs onClick
          <li className="Tab" />
        </ol>
        <div className="TabsPanel">
        // here is where we need everything thine #split-pane-wrapper to render
          {children}
        </div>
      </div>
    );
  }
}
