import React, { Component, PropTypes } from 'react';

export default class Gutter extends Component {
  static propTypes = {
    text: PropTypes.string,
    list: PropTypes.object,
    listItem: PropTypes.object,
    style: PropTypes.object,
    styleList: PropTypes.object,
    styleListItem: PropTypes.object,
    children: PropTypes.object
  }

  static defaultProps = {
    style: { border: '1px solid black' },
    styleEditor: {},
    styleList: { background: '#eee' },
    styleListItem: {}
  }

  render() {
    const { text, style, styleList, styleListItem, list, listItem, children } = this.props;

    return (
      <div style={{ ...style, display: 'flex' }}>
        <ol
          {...list}
          style={{ ...styleList, margin: 0, padding: 0 }}
        >
          {[...Array(text.split('\n').length)].map((x, i) =>
            <li
              key={i}
              {...listItem}
              style={{ ...styleListItem, listStylePosition: 'inside' }}
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
