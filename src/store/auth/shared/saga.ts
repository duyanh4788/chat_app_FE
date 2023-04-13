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

export function* sigInUserWithCode(api, action) {
  const resPonse = yield call(api.sigInUserWithCode, action.payload);
  try {
    const data = yield configResponse(resPonse);
    yield put(actions.sigInUserWithCodeSuccess(data));
  } catch (error) {
    yield put(actions.sigInUserWithCodeFail(_.get(error, 'message')));
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

export function* activeAuthCode(api, action) {
  const resPonse = yield call(api.activeAuthCode, action.payload);
  try {
    const data = yield configResponse(resPonse);
    yield put(actions.activeAuthCodeSuccess(data));
  } catch (error) {
    yield put(actions.activeAuthCodeFail(_.get(error, 'message')));
  }
}

export function* forgotPassword(api, action) {
  const resPonse = yield call(api.forgotPassword, action.payload);
  try {
    const data = yield configResponse(resPonse);
    yield put(actions.forgotPasswordSuccess(data));
  } catch (error) {
    yield put(actions.forgotPasswordFail(_.get(error, 'message')));
  }
}

export function* resendOrderForgotPassword(api, action) {
  const resPonse = yield call(api.resendOrderForgotPassword, action.payload);
  try {
    const data = yield configResponse(resPonse);
    yield put(actions.resendOrderForgotPasswordSuccess(data));
  } catch (error) {
    yield put(actions.resendOrderForgotPasswordFail(_.get(error, 'message')));
  }
}

export function* resetPassword(api, action) {
  const resPonse = yield call(api.resetPassword, action.payload);
  try {
    const data = yield configResponse(resPonse);
    yield put(actions.resetPasswordSuccess(data));
  } catch (error) {
    yield put(actions.resetPasswordFail(_.get(error, 'message')));
  }
}

export function* signUpWithFB(api, action) {
  const resPonse = yield call(api.signUpWithFB, action.payload);
  try {
    const data = yield configResponse(resPonse);
    yield put(actions.signUpWithFBSuccess(data));
  } catch (error) {
    yield put(actions.signUpWithFBFail(_.get(error, 'message')));
  }
}

export function* signUpWithGG(api, action) {
  const resPonse = yield call(api.signUpWithGG, action.payload);
  try {
    const data = yield configResponse(resPonse);
    yield put(actions.signUpWithGGSuccess(data));
  } catch (error) {
    yield put(actions.signUpWithGGFail(_.get(error, 'message')));
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

export function* getAuthPair(api, action) {
  const resPonse = yield call(api.getAuthPair, action.payload);
  try {
    const data = yield configResponse(resPonse);
    yield put(actions.getAuthPairSuccess(data));
  } catch (error) {
    yield put(actions.getAuthPairFail(_.get(error, 'message')));
  }
}

export function* pairAuth(api, action) {
  const resPonse = yield call(api.pairAuth, action.payload);
  try {
    const data = yield configResponse(resPonse);
    yield put(actions.pairAuthSuccess(data));
  } catch (error) {
    yield put(actions.pairAuthFail(_.get(error, 'message')));
  }
}

export function* AuthSaga() {
  yield all([
    yield takeLatest(actions.sigInUser.type, sigInUser, authRequest),
    yield takeLatest(actions.sigInUserWithCode.type, sigInUserWithCode, authRequest),
    yield takeLatest(actions.signUpUser.type, signUpUser, authRequest),
    yield takeLatest(actions.activeAuthCode.type, activeAuthCode, authRequest),
    yield takeLatest(actions.forgotPassword.type, forgotPassword, authRequest),
    yield takeLatest(
      actions.resendOrderForgotPassword.type,
      resendOrderForgotPassword,
      authRequest,
    ),
    yield takeLatest(actions.resetPassword.type, resetPassword, authRequest),
    yield takeLatest(actions.signUpWithFB.type, signUpWithFB, authRequest),
    yield takeLatest(actions.signUpWithGG.type, signUpWithGG, authRequest),
    yield takeLatest(actions.getUserById.type, getUserById, authRequest),
    yield takeLatest(actions.updateInfo.type, updateInfo, authRequest),
    yield takeLatest(actions.changeStatusOnline.type, changeStatusOnline, authRequest),
    yield takeLatest(actions.getAuthPair.type, getAuthPair, authRequest),
    yield takeLatest(actions.pairAuth.type, pairAuth, authRequest),
  ]);
}
