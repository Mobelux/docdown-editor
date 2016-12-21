import React, { PropTypes } from 'react';
import { Editor, EditorState, RichUtils, convertFromRaw, getDefaultKeyBinding } from 'draft-js';
import ImmutablePropTypes from 'react-immutable-proptypes';
import CodeUtils from 'draft-js-code';
import '../utils/prism-languages';
import PrismDecorator from '../utils/PrismDecorator';
import PrismToken from './PrismToken';

function findSyntax(ext = '') {
  return () => {
    const map = {
      md: 'docdown',
      markdown: 'docdown',
      ft: 'docdown',
      txt: 'docdown',
      json: 'json',
      js: 'javascript',
      java: 'java',
      cpp: 'cpp',
      swift: 'swift',
      objc: 'objectivec',
      m: 'objectivec'
    };
    return map[ext.toLowerCase()];
  };
}

function isVisible(container, el) {
  const viewport = {
    top: container.scrollTop,
    left: container.scrollLeft
  };
  viewport.right = viewport.left + container.clientWidth;
  viewport.bottom = viewport.top + container.clientHeight;

  const bounds = el.getBoundingClientRect();

  const visible = !(
    viewport.right < bounds.left ||
    viewport.left > bounds.right ||
    viewport.bottom < bounds.top ||
    viewport.top > bounds.bottom
  );

  return visible;
}

function scrollSelectionIntoView(container) {
  const selection = window.getSelection();
  if (selection.baseNode) {
    const el = selection.baseNode.parentElement;
    if (!isVisible(container, el)) {
      el.scrollIntoView(false);
    }
  }
}

class CodeEditor extends React.Component {
  static propTypes = {
    file: ImmutablePropTypes.map,
    replacer: ImmutablePropTypes.map,
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

    console.log(Date.now());
    const { file } = props;
    const filename = file.get('name') || '';
    const ext = filename.split('.')[1];
    const options = {
      defaultSyntax: 'docdown',
      filter: () => true,
      getSyntax: findSyntax(ext),
      render: PrismToken
    };
    const decorator = new PrismDecorator(options);

    const editorState = EditorState.createEmpty(decorator);
    console.log(Date.now());
    this.state = {
      editorState
    };
  }

  componentWillMount() {
    this.setInitialText(this.props.file);
  }

  componentDidMount() {
    scrollSelectionIntoView(this.container);
  }

  componentWillReceiveProps(nextProps) {
    const originalPath = this.props.file.get('path');
    const path = nextProps.file.get('path');
    if (path !== originalPath) {
      this.setInitialText(nextProps.file);
    }
    if (nextProps.replacer !== this.props.replacer) {
      this.updateText(nextProps.file);
    }
  }

  componentDidUpdate() {
    scrollSelectionIntoView(this.container);
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

    const filename = file.get('name') || '';
    const ext = filename.split('.')[1];
    const options = {
      defaultSyntax: 'docdown',
      filter: () => true,
      getSyntax: findSyntax(ext),
      render: PrismToken
    };
    const decorator = new PrismDecorator(options);

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

  updateText(file) {
    const text = file.get('raw');
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
      <pre
        ref={(e) => { this.container = e; }}
        className="language-markdown h-100 w-100"
        onClick={this.focusEditor}
      >
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

export default CodeEditor;
