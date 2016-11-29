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
import Gutter from '../components/Gutter';

class App extends React.Component {
  componentDidUpdate() {
    this.sidebar.setSize({ ...this.sidebar.props, size: this.sidebarSize() }, this.sidebar.state);
    this.pane.setSize({ ...this.pane.props, size: this.paneSize() }, this.pane.state);
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
    const { raw, rendered, ui, handleUpdate, uiActions } = this.props;

    return (
      <SplitPane
        ref={(n) => { this.sidebar = n; }}
        className="h-100 v-100"
        split="vertical"
        minSize={0}
        defaultSize={this.sidebarSize()}
        size={ui.get('sidebarVisible') ? undefined : '0'}
        allowResize={ui.get('sidebarVisible')}
        onChange={uiActions.resizeSidebar}
      >
        <Sidebar visible={ui.get('sidebarVisible')} toggle={uiActions.toggleSidebar} />
        <div id="split-pane-wrapper">
          <SplitPane
            ref={(n) => { this.pane = n; }}
            className="h-100 v-100"
            split="vertical"
            minSize={0}
            defaultSize={this.paneSize()}
            size={ui.get('paneVisible') ? undefined : '0'}
            allowResize={ui.get('paneVisible')}
            primary="second"
            onChange={uiActions.resizePane}
          >
            <div>
              <Gutter text={raw}>
                <MarkdownEditor text={raw} handleUpdate={handleUpdate} />
              </Gutter>
            </div>
            <MarkdownRendered content={rendered} visible={ui.get('paneVisible')} toggle={uiActions.togglePane} />
          </SplitPane>
        </div>
      </SplitPane>
    );
  }
}

App.propTypes = {
  raw: PropTypes.string,
  rendered: PropTypes.string,
  ui: ImmutablePropTypes.map,
  handleUpdate: PropTypes.func,
  uiActions: PropTypes.shape({
    toggleSidebar: PropTypes.func,
    togglePane: PropTypes.func,
    resizePane: PropTypes.func,
    resizeSidebar: PropTypes.func
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
