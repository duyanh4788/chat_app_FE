import { applyMiddleware, createStore, compose } from 'redux';
import createMiddleWareSaga from 'redux-saga';
import { rootReducers } from './rootReducer';
import { rootSaga } from './rootSage';

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}
const middleWareSaga = createMiddleWareSaga();
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(
  rootReducers,
  composeEnhancers(applyMiddleware(middleWareSaga)),
);
// run saga
middleWareSaga.run(rootSaga);
