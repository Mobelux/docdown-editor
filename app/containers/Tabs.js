import React, { PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { selectFile, closeFile } from '../actions/files';
import Tab from '../components/Tab';

class Tabs extends React.PureComponent {
  static propTypes = {
    files: ImmutablePropTypes.map,
    handleFile: PropTypes.func,
    handleRemoveFile: PropTypes.func,
    currentFile: PropTypes.string
  }

  constructor(props) {
    super(props);
    this.handleTabClick = ::this.handleTabClick;
    this.handleRemoveTab = ::this.handleRemoveTab;
  }

  // this is where I want to dispath the file open action with the given path
  handleTabClick(id) {
    this.props.handleFile(id);
  }

  handleRemoveTab(id) {
    this.props.handleRemoveFile(id);
  }

  render() {
    const { files, currentFile } = this.props;
    // will there ever be an instance in which there is no files?
    // I think a blank new one should be created - maybe that needs to be returned instead of null
    if (!files) {
      return null;
    }

    // this is where I want to map over each file and return the id/name/and changed
    const fileComponents = files.map(f =>
      <Tab
        id={f.get('id')}
        name={f.get('name')}
        changed={f.get('changed')}
        onTabClick={this.handleTabClick}
        onRemoveTab={this.handleRemoveTab}
        isActive={f.get('id') === currentFile}
      />
    ).valueSeq();

    // then I want to make and render the data from the maps
    return (
      <ul className="tabs__list">
        { fileComponents }
      </ul>
    );
  }
}

// this is where I need to get the state of the files from files.js reducer and pass in as props to a render method

// value of mapStateToProps will be an object derived from state (as it lives in the store),
// whose keys will be passed to your target component (the component connect is applied to) as props.
const mapStateToProps = state => ({
  files: state.files.get('files'),
  currentFile: state.files.get('currentFile')
});

// passing the file ID to actions?
const mapDispatchToProps = dispatch => ({
  handleFile: bindActionCreators(selectFile, dispatch),
  handleRemoveFile: bindActionCreators(closeFile, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Tabs);
