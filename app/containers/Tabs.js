import React from 'react';
import Tab from '../components/Tab';

class Tabs extends React.PureComponent {
  static propTypes = {
    files: PropTypes.object,
    handleFile: PropTypes.func
  }

  constructor(props){
    super(props);
    // I am not sure about the state
  }

  render() {
    // names does not exist yet but it will - these are from the fiels.js reducer
    const { files } = this.props;
    // will there ever be an instance in which there is no files?
    // I think a blank new one should be created - maybe that needs to be returned instead of null
    if (!files) {
      return null;
    }

    // this is where I want to map over each file and return the id/name/and changed

    // then I want to make and render the data from the maps
    return (
      <ul className="tabs__list">
        {files.map(f =>
          <Tab
            id={f.get('id')}
            name={f.get('name')}
            changes={f.get('changed')}
            className="tabs__item"
          />
        )})
      </ul>
    );
  }
}

// this is where I need to get the state of the files from files.js reducer and pass in as props to a render method

// value of mapStateToProps will be an object derived from state (as it lives in the store),
// whose keys will be passed to your target component (the component connect is applied to) as props.
const mapStateToProps = state => ({
  files: state.files.get('files')
});

//passing the file ID to actions?
const mapDispatchToProps = dispatch => ({
  handleFile: bindActionCreators(openFile, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Tabs);
