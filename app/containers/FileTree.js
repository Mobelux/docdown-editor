import React, { PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { getFiletree } from '../selectors';
import Folder from '../components/Folder';
import File from '../components/File';
import UnsupportedFile from '../components/UnsupportedFile';
import { openFile } from '../actions/files';
import { openFolder } from '../actions/folder';
import { isSupportedFile } from '../utils/file-types';

function buildTree(folderName, files, handleClick, forceOpen = false) {
  let listing;
  if (files) {
    listing = files.map((value, filename) => {
      if (typeof value !== 'string') {
        return buildTree(filename, value, handleClick);
      }
      if (isSupportedFile(filename)) {
        return <File key={value} name={filename} path={value} handleClick={handleClick} />;
      }
      return <UnsupportedFile key={value} name={filename} />;
    }).toList();
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
    filetree: ImmutablePropTypes.orderedMap,
    handleFile: PropTypes.func,
    startWatch: PropTypes.func
  }

  componentWillMount() {
    if (this.props.path) {
      this.props.startWatch(this.props.path);
    }
  }

  render() {
    const { path, filetree, handleFile } = this.props;
    if (!path) {
      return null;
    }
    const folderPieces = path.split('/');
    const folderName = folderPieces[folderPieces.length - 1];
    return (
      <ul>{buildTree(folderName, filetree, handleFile, true)}</ul>
    );
  }
}

const mapStateToProps = state => ({
  path: state.folder.get('folder'),
  filetree: getFiletree(state)
});
const mapDispatchToProps = dispatch => ({
  handleFile: bindActionCreators(openFile, dispatch),
  startWatch: bindActionCreators(openFolder, dispatch)
});
export default connect(mapStateToProps, mapDispatchToProps)(FileTree);
