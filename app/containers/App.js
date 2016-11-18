import React, { PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import SplitPane from 'react-split-pane';
import MarkdownEditor from '../components/MarkdownEditor';
import MarkdownRendered from '../components/MarkdownRendered';
import { updateText } from '../actions/text';
import * as uiActionCreators from '../actions/ui';
import Sidebar from '../components/Sidebar';

const App = ({ raw, rendered, ui, handleUpdate, uiActions }) => (
  <SplitPane className="h-100 v-100" split="vertical" minSize={100} defaultSize={ui.get('sidebarSize')} onChange={uiActions.handleResizeSidebar}>
    <Sidebar visible={ui.get('sidebarVisible')} toggle={uiActions.toggleSidebar} />
    <div id="split-pane-wrapper">
      <SplitPane className="h-100 v-100" split="vertical" minSize={200} defaultSize={ui.get('paneSize')} onChange={uiActions.handleResizePane}>
        <MarkdownEditor text={raw} handleUpdate={handleUpdate} />
        <MarkdownRendered content={rendered} />
      </SplitPane>
    </div>
  </SplitPane>
);

App.propTypes = {
  raw: PropTypes.string,
  rendered: PropTypes.string,
  ui: ImmutablePropTypes.map,
  handleUpdate: PropTypes.func,
  uiActions: PropTypes.shape({
    toggleSidebar: PropTypes.func,
    handleResizePane: PropTypes.func,
    handleResizeSidebar: PropTypes.func
  })
};
const mapStateToProps = state => ({
  raw: state.text.get('raw'),
  rendered: state.text.get('rendered'),
  ui: state.ui
});
const mapDispatchToProps = dispatch => ({
  handleUpdate: bindActionCreators(updateText, dispatch),
  uiActions: bindActionCreators(uiActionCreators, dispatch)
});
export default connect(mapStateToProps, mapDispatchToProps)(App);
