import React, { PropTypes } from 'react';

const PrismToken = ({ type, alias, children }) => (
  <span className={`token ${type} ${alias}`}>{children}</span>
);

PrismToken.propTypes = {
  type: PropTypes.string,
  alias: PropTypes.string,
  children: PropTypes.arrayOf(PropTypes.element)
};

export default PrismToken;
