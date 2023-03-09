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
    yield put(actions.sigInUserFail(_.get(error, 'message')));
  }
}

export function* signUpUser(api, action) {
  const resPonse = yield call(api.signUpUser, action.payload);
  try {
    const data = yield configResponse(resPonse);
    yield put(actions.signUpUserSuccess(data));
  } catch (error) {
    yield put(actions.signUpUserFail(_.get(error, 'message')));
  }
}

export function* getUserById(api, action) {
  const resPonse = yield call(api.getUserById, action.payload);
  try {
    const data = yield configResponse(resPonse);
    yield put(actions.getUserByIdSuccess(data));
  } catch (error) {
    yield put(actions.getUserByIdFail(_.get(error, 'message')));
  }
}

export function* changeStatusOnline(api, action) {
  const resPonse = yield call(api.changeStatusOnline, action.payload);
  try {
    const data = yield configResponse(resPonse);
    yield put(actions.changeStatusOnlineSuccess(data));
  } catch (error) {
    yield put(actions.changeStatusOnlineFail(_.get(error, 'message')));
  }
}

export function* updateInfo(api, action) {
  const resPonse = yield call(api.updateInfo, action.payload);
  try {
    const data = yield configResponse(resPonse);
    yield put(actions.updateInfoSuccess(data));
  } catch (error) {
    yield put(actions.updateInfoFail(_.get(error, 'message')));
  }
}

export function* AuthSaga() {
  yield all([
    yield takeLatest(actions.sigInUser.type, sigInUser, authRequest),
    yield takeLatest(actions.signUpUser.type, signUpUser, authRequest),
    yield takeLatest(actions.getUserById.type, getUserById, authRequest),
    yield takeLatest(
      actions.updateInfo.type,
      updateInfo,
      authRequest,
    ),
    yield takeLatest(
      actions.changeStatusOnline.type,
      changeStatusOnline,
      authRequest,
    ),
  ]);
}
