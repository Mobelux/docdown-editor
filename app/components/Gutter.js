import React from 'react';
import { EditorGutter } from 'draft-js-gutter';

class Gutter extends React.Component {
  render() {
    return (
      <EditorGutter
        style={{ border: '1px solid black' }}
        styleList={{ background: '#eee' }}
      />
    );
  }
}

export default Gutter;
