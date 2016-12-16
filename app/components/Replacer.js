import React from 'react';
import { ipcRenderer } from 'electron';

class Replacer extends React.Component {
  constructor(props) {
    super(props);
    this.find = ::this.find;
    this.replace = ::this.replace;
    this.replaceAll = ::this.replaceAll;
  }

  find(e) {
    e.preventDefault();
    ipcRenderer.send('find', this.findInput.value);
  }

  replace(e) {
    e.preventDefault();
    ipcRenderer.send('replace', this.findInput.value, this.replaceInput.value);
  }

  replaceAll(e) {
    e.preventDefault();
    ipcRenderer.send('replace-all', this.findInput.value, this.replaceInput.value);
  }

  render() {
    return (
      <form className="replacer" onSubmit={this.find}>
        <div className="replacer__row">
          <label className="replacer__label" htmlFor="find">Find:</label>
          <input className="replacer__input" ref={(n) => { this.findInput = n; }} type="text" />
        </div>
        <div className="replacer__row">
          <label className="replacer__label" htmlFor="replace">Replace:</label>
          <input className="replacer__input" ref={(n) => { this.replaceInput = n; }} type="text" />
        </div>
        <div className="replacer__row">
          <button className="replacer__button" onClick={this.find}>Find</button>
          <button className="replacer__button" onClick={this.replace}>Replace</button>
          <button className="replacer__button" onClick={this.replaceAll}>Replace All</button>
        </div>
      </form>
    );
  }
}

export default Replacer;
