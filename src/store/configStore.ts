import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { createInjectorsEnhancer, forceReducerReload } from 'redux-injectors';
import createSagaMiddleware from 'redux-saga';
import { createReducer } from './rootReducer';
import { config } from 'config';

export function configureAppstore() {
  const reduxSagaMonitorOptions = {};
  const sagaMiddleware = createSagaMiddleware(reduxSagaMonitorOptions);
  const { run: runSaga } = sagaMiddleware;

  let middlewares = [sagaMiddleware];
  if (config.NODE_ENV === 'development') {
    middlewares = [...middlewares];
  }
  const enhancers = [
    createInjectorsEnhancer({
      createReducer,
      runSaga,
    }),
  ];

  const defaultMiddelWare: any[] = getDefaultMiddleware({
    serializableCheck: false,
    immutableCheck: false,
  });
  const store = configureStore({
    reducer: createReducer(),
    middleware: [...defaultMiddelWare, ...middlewares],
    devTools:
      /* istanbul ignore next line */
      config.NODE_ENV === 'development',
    enhancers,
  });
  if (module.hot) {
    module.hot.accept('./rootReducer', () => {
      forceReducerReload(store);
    });
  }
  return store;
}

export const RootStore = configureAppstore();
