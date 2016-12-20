import React, { PropTypes } from 'react';
import { Editor, EditorState, RichUtils, convertFromRaw, getDefaultKeyBinding } from 'draft-js';
import ImmutablePropTypes from 'react-immutable-proptypes';
import CodeUtils from 'draft-js-code';
import '../utils/prism-docdown';
import PrismDecorator from '../utils/PrismDecorator';
import PrismToken from './PrismToken';

const options = {
  defaultSyntax: 'docdown',
  filter: () => true,
  getSyntax: () => 'docdown',
  render: PrismToken
};
const decorator = new PrismDecorator(options);

class MarkdownEditor extends React.Component {
  static propTypes = {
    file: ImmutablePropTypes.map,
    handleUpdate: PropTypes.func,
    handleSelection: PropTypes.func
  }

  constructor(props) {
    super(props);
    this.onChange = ::this.onChange;
    this.handleKeyCommand = ::this.handleKeyCommand;
    this.keyBindingFn = ::this.keyBindingFn;
    this.handleReturn = ::this.handleReturn;
    this.handleTab = ::this.handleTab;
    this.focusEditor = ::this.focusEditor;
    const editorState = EditorState.createEmpty(decorator);
    this.state = {
      editorState
    };
  }

  componentDidMount() {
    this.setInitialText(this.props.file);
  }

  componentWillReceiveProps(nextProps) {
    const originalPath = this.props.file.get('path');
    const path = nextProps.file.get('path');
    if (path !== originalPath) {
      this.setInitialText(nextProps.file);
    }
  }

  onChange(editorState) {
    const { file } = this.props;
    const contentState = editorState.getCurrentContent();
    const originalText = file.get('raw');
    const text = contentState.getPlainText();
    if (originalText !== text) {
      this.props.handleUpdate(text);
    }
    const anchor = file.get('anchor');
    const focus = file.get('focus');
    const selectionState = editorState.getSelection();
    if (anchor !== selectionState.getAnchorOffset() || focus !== selectionState.getFocusOffset()) {
      this.props.handleSelection(selectionState);
    }
    this.setState({
      editorState
    });
  }

  setInitialText(file) {
    const text = file.get('raw');
    const initialContent = {
      entityMap: {},
      blocks: [{
        type: 'code-block',
        text
      }]
    };

    const contentState = convertFromRaw(initialContent);
    let editorState = EditorState.createWithContent(contentState, decorator);
    let selectionState = editorState.getSelection();
    selectionState = selectionState.merge({
      anchorOffset: file.get('anchor'),
      focusOffset: file.get('focus')
    });
    editorState = EditorState.forceSelection(editorState, selectionState);
    this.setState({
      editorState
    });
  }

  updateText(text) {
    let { editorState } = this.state;

    const updatedContent = {
      entityMap: {},
      blocks: [{
        type: 'code-block',
        text
      }]
    };
    const contentState = convertFromRaw(updatedContent);
    editorState = EditorState.push(editorState, contentState, 'change-block-data');
    this.setState({
      editorState
    });
  }

  handleKeyCommand(command) {
    const { editorState } = this.state;
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
    const { editorState } = this.state;
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
    const { editorState } = this.state;
    if (!CodeUtils.hasSelectionInBlock(editorState)) {
      return;
    }
    this.onChange(
      CodeUtils.handleReturn(e, editorState)
    );
    return true;
  }


  handleTab(e) {
    const { editorState } = this.state;

    if (!CodeUtils.hasSelectionInBlock(editorState)) {
      return;
    }

    this.onChange(
      CodeUtils.handleTab(e, editorState)
    );
  }

  focusEditor() {
    this.editor.focus();
  }

  render() {
    const { editorState } = this.state;
    return (
      <pre className="language-markdown h-100" onClick={this.focusEditor}>
        <Editor
          ref={(e) => { this.editor = e; }}
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
