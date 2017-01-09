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
    ui: ImmutablePropTypes.map,
    handleRemoveFile: PropTypes.func,
    currentFile: PropTypes.string
  }

  render() {
    const { files, currentFile, ui, handleFile, handleRemoveFile } = this.props;

    const fileComponents = files.map((f, id) =>
      <Tab
        key={id}
        id={id}
        name={f.get('name')}
        changed={f.get('changed')}
        onTabClick={handleFile}
        onRemoveTab={handleRemoveFile}
        isActive={id === currentFile}
      />
    ).valueSeq();

    const style = { width: ui.get('sidebarVisible') ? `calc(100vw - ${ui.get('sidebarSize')}px)` : '100vw' };

    return (
      <ul className="tabs__list" style={style}>
        { fileComponents }
      </ul>
    );
  }
}

const mapStateToProps = state => ({
  files: state.files.get('files'),
  currentFile: state.files.get('currentFile'),
  ui: state.ui
});

const mapDispatchToProps = dispatch => ({
  handleFile: bindActionCreators(selectFile, dispatch),
  handleRemoveFile: bindActionCreators(closeFile, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Tabs);
