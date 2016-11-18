import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import SplitPane from 'react-split-pane';
import MarkdownEditor from '../components/MarkdownEditor';
import MarkdownRendered from '../components/MarkdownRendered';
import { updateText } from '../actions/text';
import { resizePane } from '../actions/ui';
import Sidebar from '../components/Sidebar';

const App = ({ raw, rendered, paneSize, handleUpdate, handleResize }) => (
  <SplitPane className="h-100 v-100" split="vertical" minSize={100} defaultSize={250} onChange={handleResize}>
    <Sidebar />
    <div id="split-pane-wrapper">
      <SplitPane className="h-100 v-100" split="vertical" minSize={200} defaultSize={paneSize} onChange={handleResize}>
        <MarkdownEditor text={raw} handleUpdate={handleUpdate} />
        <MarkdownRendered content={rendered} />
      </SplitPane>
    </div>
  </SplitPane>
);

App.propTypes = {
  raw: PropTypes.string,
  rendered: PropTypes.string,
  paneSize: PropTypes.number,
  handleUpdate: PropTypes.func,
  handleResize: PropTypes.func
};
const mapStateToProps = state => ({
  raw: state.text.get('raw'),
  rendered: state.text.get('rendered'),
  paneSize: state.ui.get('paneSize')
});
const mapDispatchToProps = dispatch => ({
  handleUpdate: bindActionCreators(updateText, dispatch),
  handleResize: bindActionCreators(resizePane, dispatch)
});
export default connect(mapStateToProps, mapDispatchToProps)(App);
