import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './store/configureStore';
import App from './containers/App';
import Replacer from './components/Replacer';

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
