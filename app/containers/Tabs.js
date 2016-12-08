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

  handleTabClick(id) {
    this.props.handleFile(id);
  }

  handleRemoveTab(id) {
    this.props.handleRemoveFile(id);
  }

  render() {
    const { files, currentFile } = this.props;

    if (!files) {
      return null;
    }

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

    return (
      <ul className="tabs__list">
        { fileComponents }
      </ul>
    );
  }
}

const mapStateToProps = state => ({
  files: state.files.get('files'),
  currentFile: state.files.get('currentFile')
});

const mapDispatchToProps = dispatch => ({
  handleFile: bindActionCreators(selectFile, dispatch),
  handleRemoveFile: bindActionCreators(closeFile, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Tabs);