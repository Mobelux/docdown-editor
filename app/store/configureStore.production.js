import { ipcRenderer } from 'electron';
import { createStore, applyMiddleware, compose } from 'redux';
import { persistStore, autoRehydrate } from 'redux-persist';
import { asyncSessionStorage } from 'redux-persist/storages';
import immutableTransform from 'redux-persist-transform-immutable';
import { createEpicMiddleware } from 'redux-observable';
import rootReducer from '../reducers';
import rootEpic from '../epics';

const epicMiddleware = createEpicMiddleware(rootEpic);

const enhancer = compose(
  autoRehydrate(),
  applyMiddleware(epicMiddleware)
);

export default function configureStore(initialState) {
  const store = createStore(rootReducer, initialState, enhancer);
  persistStore(store, { storage: asyncSessionStorage, transforms: [immutableTransform()] });

  ipcRenderer.on('redux', (event, action) => {
    store.dispatch(action);
  });

  return store;
}
