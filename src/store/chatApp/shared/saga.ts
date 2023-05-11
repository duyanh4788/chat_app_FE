import { call, put, takeLatest, all } from 'redux-saga/effects';
import { actions } from './slice';
import { ChatAppHttp } from '../service/chatapp.http';
import { configResponse, configResponseError } from 'store/services/request';

export function* getListUsers(api, action) {
  const resPonse = yield call(api.getListUsers, action.payload);
  try {
    const data = yield configResponse(resPonse);
    yield put(actions.getListUsersSuccess(data));
  } catch (error) {
    yield put(actions.getListUsersFail(configResponseError(error)));
  }
}

export function* searchUsers(api, action) {
  const resPonse = yield call(api.searchUsers, action.payload);
  try {
    const data = yield configResponse(resPonse);
    yield put(actions.searchUsersSuccess(data));
  } catch (error) {
    yield put(actions.searchUsersFail(configResponseError(error)));
  }
}

export function* getListMessages(api, action) {
  const resPonse = yield call(api.getListMessages, action.payload);
  try {
    const data = yield configResponse(resPonse);
    yield put(actions.getListMessagesSuccess(data));
  } catch (error) {
    yield put(actions.getListMessagesFail(configResponseError(error)));
  }
}

export function* postNewMessage(api, action) {
  const resPonse = yield call(api.postNewMessage, action.payload);
  try {
    const data = yield configResponse(resPonse);
    yield put(actions.postNewMessageSuccess(data));
  } catch (error) {
    yield put(actions.postNewMessageFail(configResponseError(error)));
  }
}

export function* saveConvertStation(api, action) {
  const resPonse = yield call(api.saveConvertStation, action.payload);
  try {
    const data = yield configResponse(resPonse);
    yield put(actions.saveConvertStationSuccess(data));
  } catch (error) {
    yield put(actions.saveConvertStationFail(configResponseError(error)));
  }
}

export function* changeStatusoffline(api, action) {
  const resPonse = yield call(api.changeStatusoffline, action.payload);
  try {
    const data = yield configResponse(resPonse);
    yield put(actions.changeStatusofflineSuccess(data));
  } catch (error) {
    yield put(actions.changeStatusofflineFail(configResponseError(error)));
  }
}

export function* postUploadAWS3(api, action) {
  const resPonse = yield call(api.postUploadAWS3, action.payload);
  try {
    const data = yield configResponse(resPonse);
    yield put(actions.postUploadAWS3Success(data));
  } catch (error) {
    yield put(actions.postUploadAWS3Fail(configResponseError(error)));
  }
}

export function* removeUploadAWS3(api, action) {
  const resPonse = yield call(api.removeUploadAWS3, action.payload);
  try {
    const data = yield configResponse(resPonse);
    yield put(actions.removeUploadAWS3Success(data));
  } catch (error) {
    yield put(actions.removeUploadAWS3Fail(configResponseError(error)));
  }
}

export function* ChatAppSaga() {
  const chatApptRequest = new ChatAppHttp();
  yield all([
    yield takeLatest(actions.changeStatusoffline.type, changeStatusoffline, chatApptRequest),
    yield takeLatest(actions.getListUsers.type, getListUsers, chatApptRequest),
    yield takeLatest(actions.searchUsers.type, searchUsers, chatApptRequest),
    yield takeLatest(actions.postNewMessage.type, postNewMessage, chatApptRequest),
    yield takeLatest(actions.saveConvertStation.type, saveConvertStation, chatApptRequest),
    yield takeLatest(actions.getListMessages.type, getListMessages, chatApptRequest),
    yield takeLatest(actions.postUploadAWS3.type, postUploadAWS3, chatApptRequest),
    yield takeLatest(actions.removeUploadAWS3.type, removeUploadAWS3, chatApptRequest),
  ]);
}
