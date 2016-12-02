import React, { PropTypes } from 'react';
import cx from 'classnames';

class TabBar extends React.Component {
  static PropTypes = {
    // not sure if this is necessary
    children: PropTypes.object
  }

  constructor(props) {
    // so props are not undefined
    super(props);
    // rebinding
    this.handleTabClick = ::this.handleTabClick;
    // initializing state
    this.state = {
      // no selection intially
      selected: 0
    };
  }

  // event handler for tab click - will need an onClick on the individual Tab componenet
  handleTabClick(e) {
    // dataset holds the index
    const { tabid } = e.target.dataset;
    // changes the state and rerenders. Selected is now a number from the tabId
    this.setState({ selected: parseInt(tabid) });
  }

  render() {
    const { children } = this.props;
    const tabs = [];
    const tabContents = [];

    // maps over the children to generate a list of tabs and tab content
    React.Children.forEach(children, (tab, idx) => {
      // creates an array of tabs
      tabs.push(
        <li
          // tab-view__tab is the static className, and if this.state.selected === idk then
          className={cx('tab-view__tab', { 'is-active': this.state.selected === idx })}
          // el.dataset.tabID === idx
          data-tabId={idx}
          onClick={this.handleTabClick}
        >
          // { tab.props.name }
          inside the li
        </li>
      );
      tabContents.push(
        <div
          // tab-view__tab-contents is hidden if state is not equal to idx
          className={cx('tab-view__tab-contents', { 'is-hidden': this.state.selected !== idx })}
        >
          { tab }
        </div>
      );
    });

    return (
      <div className="tab-view">
        <ol
          className="tab-view__tabs"
        >
          { tabs }
        </ol>
      </div>
    );
  }
}

export default TabBar;
