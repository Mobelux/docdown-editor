import React, { PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
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
    selection: ImmutablePropTypes.map,
    handleUpdate: PropTypes.func
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
      editorState,
      selectionState: editorState.getSelection()
    };
  }

  componentDidMount() {
    const text = this.props.file.get('raw');
    this.setInitialText(text);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.file !== this.props.file) {
      const text = nextProps.file.get('raw');
      this.setInitialText(text);
    }
    if (nextProps.selection !== this.props.selection) {
      this.setSelection(nextProps.selection);
      if (nextProps.selection.get('update')) {
        this.updateText(nextProps.text);
      }
    }
  }

  onChange(editorState) {
    let { selectionState } = this.state;
    const contentState = editorState.getCurrentContent();
    if (selectionState !== editorState.getSelection()) {
      selectionState = editorState.getSelection();
    }
    const originalText = this.props.file.get('raw');
    const text = contentState.getPlainText();
    if (originalText !== text) {
      this.props.handleUpdate(text);
    }
    this.setState({
      editorState,
      selectionState
    });
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
    const editorState = EditorState.createWithContent(contentState, decorator);
    this.setState({
      editorState,
      selectionState: editorState.getSelection()
    });
  }

  setSelection(selection) {
    const { text } = this.props;
    const find = selection.get('find');
    // const replace = selection.get('replace');
    // const count = selection.get('count');
    let { selectionState } = this.state;
    const start = selectionState.getStartOffset();
    const end = selectionState.getEndOffset();
    const from = Math.max.apply(Math, [start, end]);
    const next = text.indexOf(find, from);
    if (next > -1) {
      selectionState = selectionState.merge({ anchorOffset: next, focusOffset: next + find.length, isBackward: false });
    }
    this.setState({
      selectionState
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

  focusEditor() {
    this.editor.focus();
  }

  render() {
    const { selectionState } = this.state;
    let { editorState } = this.state;
    editorState = EditorState.forceSelection(editorState, selectionState);
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
