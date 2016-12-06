import 'prismjs';
import 'prismjs/components/prism-markdown';
import React, { PropTypes } from 'react';
import { Editor, EditorState, RichUtils, convertFromRaw, getDefaultKeyBinding } from 'draft-js';
import CodeUtils from 'draft-js-code';
import PrismDecorator from '../utils/PrismDecorator';
import PrismToken from './PrismToken';

const options = {
  defaultSyntax: 'markdown',
  filter: () => true,
  getSyntax: () => 'markdown',
  render: PrismToken
};
const decorator = new PrismDecorator(options);

class MarkdownEditor extends React.Component {
  static propTypes = {
    file: PropTypes.string,
    text: PropTypes.string,
    handleUpdate: PropTypes.func
  }

  constructor(props) {
    super(props);
    this.onChange = ::this.onChange;
    this.handleKeyCommand = ::this.handleKeyCommand;
    this.keyBindingFn = ::this.keyBindingFn;
    this.handleReturn = ::this.handleReturn;
    this.handleTab = ::this.handleTab;
    this.state = { editorState: EditorState.createEmpty(decorator) };
  }

  componentDidMount() {
    this.setInitialText(this.props.text);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.file !== this.props.file && nextProps.text !== '') {
      this.setInitialText(nextProps.text);
    }
  }

  onChange(editorState) {
    this.props.handleUpdate(editorState.getCurrentContent().getPlainText());
    this.setState({ editorState });
  }

  setInitialText(text) {
    const initialContent = {
      entityMap: {},
      blocks: [{
        type: 'code-block',
        text
      }]
    };

    const contentState = convertFromRaw(initialContent);

    this.setState({ editorState: EditorState.createWithContent(contentState, decorator) });
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
    );
  }
}

export default MarkdownEditor;
