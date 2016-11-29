import React, { Component, PropTypes } from 'react';

export default class Gutter extends Component {
  static propTypes = {
    text: PropTypes.string,
    listItem: PropTypes.object,
    children: PropTypes.object
  }

  render() {
    const { text, listItem, children } = this.props;

    return (
      <div style={{ display: 'flex' }}>
        <ol
          className="gutter"
        >
          {[...Array(text.split('\n').length)].map((x, i) =>
            <li
              className="gutter__num"
              key={i}
              {...listItem}
              style={{ listStylePosition: 'inside' }}
            />
          )}
        </ol>
        <div style={{ flex: 1 }}>
          {children}
        </div>
      </div>
    );
  }
}
