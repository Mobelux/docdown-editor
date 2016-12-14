import React, { PropTypes } from 'react';

const UnsupportedFile = ({ name }) => (
  <li className="o-40">
    <span>{name}</span>
  </li>
);

UnsupportedFile.propTypes = {
  name: PropTypes.string
};

export default UnsupportedFile;
