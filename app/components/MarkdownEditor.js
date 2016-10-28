import 'prismjs';
import 'prismjs/components/prism-markdown';
import React from 'react';
import { Editor, EditorState, convertFromRaw } from 'draft-js';
import PrismDecorator from 'draft-js-prism';

function plainRender(props) {
  props = extend({}, props, {
    className: 'token ' + props.type
  });

  return React.createElement(
    "span",
    props,
    props.children
  );
}

const options = {
  defaultSyntax: 'markdown',
  filter: () => true,
  getSyntax: () => 'markdown',
  render: plainRender
};
const decorator = new PrismDecorator(options);

class MarkdownEditor extends React.Component {
  constructor(props) {
    super(props);

    const initialContent = {
      entityMap: {},
      blocks: [{
        type: 'code-block',
        text: props.text
      }]
    };

    const contentState = convertFromRaw(initialContent);

    this.state = { editorState: EditorState.createWithContent(contentState, decorator) };
    this.onChange = editorState => this.setState({ editorState });
  }
  render() {
    const { editorState } = this.state;
    return (
      <div className="flex-1-50">
        <pre className="language-markdown">
          <Editor editorState={editorState} onChange={this.onChange} />
        </pre>
      </div>
    );
  }
}

export default MarkdownEditor;
