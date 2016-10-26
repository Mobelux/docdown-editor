import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import MarkdownEditor from '../components/MarkdownEditor';
import MarkdownRendered from '../components/MarkdownRendered';

const App = ({ raw, rendered }) => (
  <div className="flex justify-between items-stretch h-100">
    <MarkdownEditor text={raw} />
    <MarkdownRendered content={rendered} />
  </div>
);

App.propTypes = {
  text: PropTypes.string
};
const mapStateToProps = state => ({
  raw: state.text.get('raw'),
  rendered: state.text.get('rendered')
})
export default connect(mapStateToProps)(App);
