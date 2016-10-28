import 'prismjs';
import 'prismjs/components/prism-markdown';
import React from 'react';
import { Editor, EditorState, RichUtils, convertFromRaw, getDefaultKeyBinding } from 'draft-js';
import PrismDecorator from '../utils/PrismDecorator';
import PrismToken from './PrismToken';
import CodeUtils from 'draft-js-code';

const options = {
  defaultSyntax: 'markdown',
  filter: () => true,
  getSyntax: () => 'markdown',
  render: PrismToken
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
    this.handleKeyCommand = ::this.handleKeyCommand;
    this.keyBindingFn = ::this.keyBindingFn;
    this.handleReturn = ::this.handleReturn;
    this.handleTab = ::this.handleTab;
  }

  handleKeyCommand(command) {
    const editorState = this.state.editorState;
    let newState;

    if (CodeUtils.hasSelectionInBlock(editorState)) {
      newState = CodeUtils.handleKeyCommand(editorState, command);
    }

    if (!newState) {
      newState = RichUtils.handleKeyCommand(editorState, command);
    }

    if (newState) {
      this.onChange(newState);
      return true;
    }
    return false;
  }

  keyBindingFn(e) {
    const editorState = this.state.editorState;
    let command;

    if (CodeUtils.hasSelectionInBlock(editorState)) {
      command = CodeUtils.getKeyBinding(e);
    }
    if (command) {
      return command;
    }

    return getDefaultKeyBinding(e);
  }

  handleReturn(e) {
    const editorState = this.state.editorState;
    if (!CodeUtils.hasSelectionInBlock(editorState)) {
      return;
    }
    this.onChange(
      CodeUtils.handleReturn(e, editorState)
    );
    return true;
  }


  handleTab(e) {
    const editorState = this.state.editorState;

    if (!CodeUtils.hasSelectionInBlock(editorState)) {
      return;
    }

    this.onChange(
      CodeUtils.handleTab(e, editorState)
    );
  }

  render() {
    const { editorState } = this.state;
    return (
      <div className="flex-1-50">
        <pre className="language-markdown">
          <Editor
            editorState={editorState}
            onChange={this.onChange}
            keyBindingFn={this.keyBindingFn}
            handleKeyCommand={this.handleKeyCommand}
            handleReturn={this.handleReturn}
            onTab={this.handleTab}
          />
        </pre>
      </div>
    );
  }
}

export default MarkdownEditor;
