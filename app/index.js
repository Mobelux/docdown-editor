/* global document */
import fs from 'fs';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './store/configureStore';
import App from './containers/App';
import Replacer from './components/Replacer';
import { openFolder, openFile } from './actions/files';

const store = configureStore();

const root = document.getElementById('root');
if (root) {
  render(
    <Provider store={store}>
      <App />
    </Provider>,
    root
  );
}

const replacer = document.getElementById('replacer');
if (replacer) {
  render(
    <Replacer />,
    replacer
  );
}

document.addEventListener('drop', (e) => {
  e.preventDefault();
  e.stopPropagation();
  for (const f of e.dataTransfer.files) {
    const stat = fs.statSync(f.path);
    if (stat.isFile()) {
      store.dispatch(openFile(f.path));
    }
    if (stat.isDirectory()) {
      store.dispatch(openFolder(f.path));
    }
  }
  return false;
});
document.addEventListener('dragover', (e) => {
  e.preventDefault();
  e.stopPropagation();
});
