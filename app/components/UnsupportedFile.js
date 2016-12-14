import React, { PropTypes } from 'react';
import Icon from './Icon';

const UnsupportedFile = ({ name }) => (
  <li className="o-40">
    <span><Icon name="file" />&nbsp;{name}</span>
  </li>
);

UnsupportedFile.propTypes = {
  name: PropTypes.string
};

export default UnsupportedFile;
