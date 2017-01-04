import React, { PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import brace from 'brace';
import AceEditor from 'react-ace';
import 'brace/mode/markdown';
import '../styles/ace-theme';
import '../utils/docdown-rules';
import '../utils/docdown-mode';

function findSyntax(ext = '') {
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
    fontSize: PropTypes.number,
    handleUpdate: PropTypes.func,
    handleSelection: PropTypes.func
  }

  constructor(props) {
    super(props);
    this.onChange = ::this.onChange;
    this.focusEditor = ::this.focusEditor;
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

  onChange(text) {
    const { file } = this.props;
    const originalText = file.get('raw');
    if (originalText !== text) {
      this.props.handleUpdate(text);
    }
    // const anchor = file.get('anchor');
    // const focus = file.get('focus');
    // const selectionState = editorState.getSelection();
    // if (anchor !== selectionState.getAnchorOffset() || focus !== selectionState.getFocusOffset()) {
    //   this.props.handleSelection(selectionState);
    // }
    // this.setState({
    //   editorState
    // });
  }

  setInitialText(file) {
    // const text = file.get('raw');
    // const initialContent = {
    //   entityMap: {},
    //   blocks: [{
    //     type: 'code-block',
    //     text
    //   }]
    // };
    //
    // const contentState = convertFromRaw(initialContent);
    //
    // const filename = file.get('name') || '';
    // const ext = filename.split('.')[1];
    // const options = {
    //   defaultSyntax: 'docdown',
    //   filter: () => true,
    //   getSyntax: findSyntax(ext),
    //   render: PrismToken
    // };
    // const decorator = new PrismDecorator(options);
    //
    // let editorState = EditorState.createWithContent(contentState, decorator);
    // let selectionState = editorState.getSelection();
    // selectionState = selectionState.merge({
    //   anchorOffset: file.get('anchor'),
    //   focusOffset: file.get('focus')
    // });
    // editorState = EditorState.forceSelection(editorState, selectionState);
    // this.setState({
    //   editorState
    // });
  }

  updateText(file) {
    // const text = file.get('raw');
    // let { editorState } = this.state;
    //
    // const updatedContent = {
    //   entityMap: {},
    //   blocks: [{
    //     type: 'code-block',
    //     text
    //   }]
    // };
    // const contentState = convertFromRaw(updatedContent);
    // editorState = EditorState.push(editorState, contentState, 'change-block-data');
    // let selectionState = editorState.getSelection();
    // selectionState = selectionState.merge({
    //   anchorOffset: file.get('anchor'),
    //   focusOffset: file.get('focus')
    // });
    // editorState = EditorState.forceSelection(editorState, selectionState);
    // this.setState({
    //   editorState
    // });
  }

  focusEditor() {
  }

  render() {
    const { file, fontSize } = this.props;
    const filename = file.get('name') || '';
    const ext = filename.split('.')[1];
    const mode = findSyntax(ext) || 'docdown';
    return (
      <pre
        ref={(e) => { this.container = e; }}
        className={`language-markdown h-100 w-100 fs-${fontSize}`}
        onClick={this.focusEditor}
      >
        <div className="pa40 h-100" onClick={(e) => { e.stopPropagation(); }}>
          <AceEditor
            mode={mode}
            theme="livio"
            width="100%"
            height="100%"
            fontSize="15"
            onChange={this.onChange}
            name="docdown-editor"
            value={file.get('raw')}
            wrapEnabled
            focus
            editorProps={{ $blockScrolling: true }}
          />
        </div>
      </pre>
    );
  }
}

export default CodeEditor;
