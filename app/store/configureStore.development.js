import { ipcRenderer } from 'electron';
import { createStore, applyMiddleware, compose } from 'redux';
import { persistStore, autoRehydrate } from 'redux-persist';
import { asyncSessionStorage } from 'redux-persist/storages';
import immutableTransform from 'redux-persist-transform-immutable';
import { createEpicMiddleware } from 'redux-observable';
import { createLogger } from 'redux-logger';
import rootReducer from '../reducers';
import rootEpic from '../epics';

import * as fileActions from '../actions/files';
import * as uiActions from '../actions/ui';

const epicMiddleware = createEpicMiddleware(rootEpic);

const actionCreators = {
  ...fileActions,
  ...uiActions
};

const logger = createLogger({
  level: 'info',
  collapsed: true
});

const enhancer = compose(
  autoRehydrate(),
  applyMiddleware(epicMiddleware, logger),
  window.devToolsExtension ?
    window.devToolsExtension({ actionCreators }) :
    noop => noop
);

export default function configureStore(initialState) {
  const store = createStore(rootReducer, initialState, enhancer);
  persistStore(store, { storage: asyncSessionStorage, transforms: [immutableTransform()] });


  if (window.devToolsExtension) {
    window.devToolsExtension.updateStore(store);
  }

  if (module.hot) {
    module.hot.accept('../reducers', () =>
      store.replaceReducer(require('../reducers')) // eslint-disable-line global-require
    );
  }

  ipcRenderer.on('redux', (event, action) => {
    store.dispatch(action);
  });

  return store;
}
