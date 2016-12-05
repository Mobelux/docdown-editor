import React, { PropTypes } from 'react';
import { mapProps } from 'recompose';

const File = ({ name, handleClick }) => (
  <li>
    <a href={`#${name}`} onClick={handleClick}>
      <span>{name}</span>
    </a>
  </li>
);

File.propTypes = {
  name: PropTypes.string,
  path: PropTypes.string,
  handleClick: PropTypes.func
};

const defaultPreventer = mapProps(({ name, path, handleClick }) => (
  {
    name,
    path,
    handleClick: (e) => {
      e.preventDefault();
      handleClick(path);
    }
  }
));
export default defaultPreventer(File);
