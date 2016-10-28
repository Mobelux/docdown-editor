import React from 'react';

const PrismToken = (props) => {
  return (
    <span {...props} className={`token ${props.type} ${props.alias}`} />
  );
}

export default PrismToken;
