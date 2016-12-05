import React from 'react';

class Tab extends React.Component {
  static propTypes = {
    name: PropTypes.string,
    id: PropTypes.number
  }

  render() {
    const { name, id } = this.props;

    return (
      <li>
        { this.props.name }
      </li>
    );
  }
}
