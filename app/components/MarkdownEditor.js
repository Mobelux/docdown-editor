import React from 'react';
import { Editor, EditorState } from 'draft-js';

class MarkdownEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = { editorState: EditorState.createEmpty() };
    this.onChange = editorState => this.setState({ editorState });
  }
  render() {
    const { editorState } = this.state;
    return (
      <div className="flex-1-50">
        <Editor editorState={editorState} onChange={this.onChange} />
      </div>
    );
  }
}

export default MarkdownEditor;
