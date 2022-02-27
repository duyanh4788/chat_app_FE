import { call, put, takeLatest, all } from 'redux-saga/effects';
import { actions } from './slice';
import * as _ from 'lodash';
import { AuthHttp } from '../service/auth.http';
import { configResponse } from 'store/services/request';
const authRequest = new AuthHttp();

export function* sigInUser(api, action) {
  const resPonse = yield call(api.signInUser, action.payload);
  try {
    const data = yield configResponse(resPonse);
    yield put(actions.sigInUserSuccess(data));
  } catch (error) {
    yield put(actions.sigInUserSuccess(_.get(error, 'message')));
  }
}

export function* signUpUser(api, action) {
  const resPonse = yield call(api.signUpUser, action.payload);
  try {
    const data = yield configResponse(resPonse);
    yield put(actions.signUpUserSuccess(data));
  } catch (error) {
    yield put(actions.signUpUserSuccess(_.get(error, 'message')));
  }
}

export function* AuthSaga() {
  yield all([yield takeLatest(actions.sigInUser.type, sigInUser, authRequest)]);
  yield all([
    yield takeLatest(actions.signUpUser.type, signUpUser, authRequest),
  ]);
}
