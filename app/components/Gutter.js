import React, { PropTypes } from 'react';

const Gutter = ({ text, listItem, children }) => (
  <div style={{ display: 'flex' }} className="vh-100 overflow-container bg-dark-black">
    <ol className="gutter">
      {[...Array(text.split('\n').length)].map((x, i) =>
        <li
          className="gutter__num"
          key={i}
          {...listItem}
        />
      )}
    </ol>
    <div style={{ flex: 1 }}>
      {children}
    </div>
  </div>
);

Gutter.propTypes = {
  text: PropTypes.string,
  listItem: PropTypes.object,
  children: PropTypes.object
};

export default Gutter;
