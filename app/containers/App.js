import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import MarkdownEditor from '../components/MarkdownEditor';
import MarkdownRendered from '../components/MarkdownRendered';
import { updateText } from '../actions/text';

const App = ({ raw, rendered, handleUpdate }) => (
  <div className="flex justify-between items-stretch h-100">
    <MarkdownEditor text={raw} handleUpdate={handleUpdate} />
    <MarkdownRendered content={rendered} />
  </div>
);

App.propTypes = {
  raw: PropTypes.string,
  rendered: PropTypes.string,
  handleUpdate: PropTypes.func
};
const mapStateToProps = state => ({
  raw: state.text.get('raw'),
  rendered: state.text.get('rendered')
});
const mapDispatchToProps = dispatch => ({
  handleUpdate: bindActionCreators(updateText, dispatch)
});
export default connect(mapStateToProps, mapDispatchToProps)(App);
