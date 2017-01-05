import React, { PropTypes } from 'react';

const Icon = ({ name }) => (
  <svg xmlnsXlink="http://www.w3.org/1999/xlink" className={`icon icon-${name}`}>
    <use xlinkHref={`#icon-${name}`} />
  </svg>
);

Icon.propTypes = {
  name: PropTypes.string.isRequired
};

export default Icon;
