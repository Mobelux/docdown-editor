import React, { PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import SplitPane from 'react-split-pane';
import Tabs from '../containers/Tabs';
import Panel from '../components/Panel';
import MarkdownEditor from '../components/MarkdownEditor';
import MarkdownRendered from '../components/MarkdownRendered';
import CharacterCount from '../components/CharacterCount';
import StatusBar from '../components/StatusBar';
import Sidebar from '../components/Sidebar';
import Icon from '../components/Icon';
import * as fileActionCreators from '../actions/files';
import * as uiActionCreators from '../actions/ui';
import { getCurrentFile } from '../selectors';

class App extends React.Component {
  componentDidMount() {
    const { currentFile, fileActions } = this.props;
    if (!currentFile.get('id')) {
      fileActions.newFile();
    }
  }

  componentDidUpdate() {
    this.sidebar.setSize({ ...this.sidebar.props, size: this.sidebarSize() }, this.sidebar.state);
    this.pane.setSize({ ...this.pane.props, size: this.paneSize() }, this.pane.state);
    const { currentFile, fileActions } = this.props;
    if (!currentFile.get('id')) {
      fileActions.newFile();
    }
  }

  sidebarSize() {
    const { ui } = this.props;
    return ui.get('sidebarVisible') ? ui.get('sidebarSize') : '0';
  }

  paneSize() {
    const { ui } = this.props;
    return ui.get('paneVisible') ? ui.get('paneSize') : '0';
  }

  render() {
    const { currentFile, ui, fileActions, uiActions } = this.props;
    const raw = currentFile.get('raw', '');
    const rendered = currentFile.get('rendered', '');

    return (
      <SplitPane
        ref={(n) => { this.sidebar = n; }}
        className="vh-100"
        paneStyle={{ height: '100vh' }}
        split="vertical"
        minSize={0}
        defaultSize={this.sidebarSize()}
        size={ui.get('sidebarVisible') ? undefined : '0'}
        allowResize={ui.get('sidebarVisible')}
        onChange={uiActions.resizeSidebar}
      >
        <Sidebar visible={ui.get('sidebarVisible')} />
        <div className="split-pane-wrapper">
          <Tabs />
          <SplitPane
            ref={(n) => { this.pane = n; }}
            className="h-100"
            split="vertical"
            minSize={0}
            defaultSize={this.paneSize()}
            size={ui.get('paneVisible') ? undefined : '0'}
            allowResize={ui.get('paneVisible')}
            primary="second"
            onChange={uiActions.resizePane}
          >
            <div className="flex flex-column h-100">
              <Panel className={ui.get('countVisible') ? 'panel--status' : ''}>
                <MarkdownEditor
                  file={currentFile}
                  handleUpdate={fileActions.updateFile}
                  handleSelection={fileActions.updateSelection}
                />
              </Panel>
              <StatusBar visible={ui.get('countVisible')} className="flex justify-between">
                <a href="#files" onClick={uiActions.toggleSidebar}>
                  <Icon name={ui.get('sidebarVisible') ? 'left' : 'right'} />
                </a>
                <CharacterCount text={raw} />
                <a href="#preview" onClick={uiActions.togglePane}>
                  <Icon name={ui.get('paneVisible') ? 'right' : 'left'} />
                </a>
              </StatusBar>
            </div>
            <Panel>
              <MarkdownRendered content={rendered} visible={ui.get('paneVisible')} />
            </Panel>
          </SplitPane>
        </div>
      </SplitPane>
    );
  }
}

App.propTypes = {
  currentFile: ImmutablePropTypes.map,
  ui: ImmutablePropTypes.map,
  fileActions: PropTypes.shape({
    newFile: PropTypes.func,
    updateFile: PropTypes.func
  }),
  uiActions: PropTypes.shape({
    toggleSidebar: PropTypes.func,
    togglePane: PropTypes.func,
    resizePane: PropTypes.func,
    resizeSidebar: PropTypes.func
  })
};
const mapStateToProps = state => ({
  currentFile: getCurrentFile(state),
  ui: state.ui
});
const mapDispatchToProps = dispatch => ({
  fileActions: bindActionCreators(fileActionCreators, dispatch),
  uiActions: bindActionCreators(uiActionCreators, dispatch)
});
export default connect(mapStateToProps, mapDispatchToProps)(App);
