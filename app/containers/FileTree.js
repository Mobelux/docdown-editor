import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import watch from 'watch';
import { Map, OrderedMap } from 'immutable';
import Folder from '../components/Folder';
import File from '../components/File';
import { openFile } from '../actions/files';

const watchOptions = {
  ignoreDotFiles: true,
  ignoreUnreadableDir: true,
  ignoreNotPermitted: true,
  ignoreDirectoryPattern: /node_modules/
};

function buildTree(folderName, files, handleClick, forceOpen = false) {
  let listing;
  if (files) {
    listing = files.entrySeq().map(([filename, value]) => {
      if (typeof value !== 'string') {
        return buildTree(filename, value, handleClick);
      }
      return <File key={value} name={filename} path={value} handleClick={handleClick} />;
    });
  }
  return (
    <Folder key={folderName} name={folderName} forceOpen={forceOpen}>
      {listing}
    </Folder>
  );
}

class FileTree extends React.PureComponent {
  static propTypes = {
    path: PropTypes.string,
    handleFile: PropTypes.func
  }

  constructor(props) {
    super(props);

    this.updateTree = ::this.updateTree;
    this.state = {
      filetree: Map({})
    };
  }

  componentWillMount() {
    if (this.props.path) {
      watch.watchTree(this.props.path, watchOptions, this.updateTree);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.path !== nextProps.path) {
      if (this.props.path) {
        watch.unwatchTree(this.props.path);
      }
      if (nextProps.path) {
        watch.watchTree(nextProps.path, watchOptions, this.updateTree);
      }
    }
  }

  componentWillUnmount() {
    if (this.props.path) {
      watch.unwatchTree(this.props.path);
    }
  }

  updateTree(f, curr, prev) {
    if (typeof f === 'object' && prev === null && curr === null) {
      // Finished walking the tree
      this.setState({ filetree: Map(f) });
    } else {
      const { filetree } = this.state;
      if (prev === null) {
        // f is a new file
        this.setState({ filetree: filetree.set(f, curr) });
      } else if (curr.nlink === 0) {
        // f was removed
        this.setState({ filetree: filetree.delete(f) });
      }
    }
  }

  render() {
    const { path, handleFile } = this.props;
    if (!path) {
      return null;
    }
    const folderPieces = path.split('/');
    const folderName = folderPieces[folderPieces.length - 1];
    const { filetree } = this.state;
    const basePath = path.replace(folderName, '');
    const tree = filetree.reduce((acc, stat, f) => {
      const pieces = f.replace(basePath, '').split('/');
      let value = f;
      if (stat.isDirectory()) {
        value = OrderedMap({});
      }
      return acc.setIn(pieces, value);
    }, OrderedMap({}));
    const files = tree.get(folderName);
    return (
      <ul>{buildTree(folderName, files, handleFile, true)}</ul>
    );
  }
}

const mapStateToProps = state => ({
  path: state.files.get('folder')
});
const mapDispatchToProps = dispatch => ({
  handleFile: bindActionCreators(openFile, dispatch)
});
export default connect(mapStateToProps, mapDispatchToProps)(FileTree);
