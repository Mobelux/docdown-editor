import React, { PropTypes } from 'react';

const UnsupportedFile = ({ name }) => (
  <li>
    <span>{name}</span>
  </li>
);

UnsupportedFile.propTypes = {
  name: PropTypes.string
};

export default UnsupportedFile;
