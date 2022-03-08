import { call, put, takeLatest, all } from 'redux-saga/effects';
import { actions } from './slice';
import * as _ from 'lodash';
import { ChatAppHttp } from '../service/chatapp.http';
import { configResponse } from 'store/services/request';

const chatApptRequest = new ChatAppHttp();
export function* getListUsers(api, action) {
  const resPonse = yield call(api.getListUsers, action.payload);
  try {
    const data = yield configResponse(resPonse);
    yield put(actions.getListUsersSuccess(data));
  } catch (error) {
    yield put(actions.getListUsersFail(_.get(error, 'message')));
  }
}

export function* postNewMessage(api, action) {
  const resPonse = yield call(api.postNewMessage, action.payload);
  try {
    const data = yield configResponse(resPonse);
    yield put(actions.postNewMessageSuccess(data));
  } catch (error) {
    yield put(actions.postNewMessageFail(_.get(error, 'message')));
  }
}

export function* convertStationMyFriend(api, action) {
  const resPonse = yield call(api.convertStationMyFriend, action.payload);
  try {
    const data = yield configResponse(resPonse);
    yield put(actions.convertStationMyFriendSuccess(data));
  } catch (error) {
    yield put(actions.convertStationMyFriendFail(_.get(error, 'message')));
  }
}

// ======================================================= //

export function* getUserById(api, action) {
  const resPonse = yield call(api.getUserById, action.payload);
  try {
    const data = yield configResponse(resPonse);
    yield put(actions.getUserByIdSuccess(data));
  } catch (error) {
    yield put(actions.getUserByIdFail(_.get(error, 'message')));
  }
}

export function* getFriendById(api, action) {
  const resPonse = yield call(api.getFriendById, action.payload);
  try {
    const data = yield configResponse(resPonse);
    yield put(actions.getFriendByIdSuccess(data));
  } catch (error) {
    yield put(actions.getFriendByIdFail(_.get(error, 'message')));
  }
}

export function* saveConvertStation(api, action) {
  const resPonse = yield call(api.saveConvertStation, action.payload);
  try {
    const data = yield configResponse(resPonse);
    yield put(actions.saveConvertStationSuccess(data));
  } catch (error) {
    yield put(actions.saveConvertStationFail(_.get(error, 'message')));
  }
}

export function* convertStationByUserId(api, action) {
  const resPonse = yield call(api.convertStationByUserId, action.payload);
  try {
    const data = yield configResponse(resPonse);
    yield put(actions.convertStationByUserIdSuccess(data));
  } catch (error) {
    yield put(actions.convertStationByUserIdFail(_.get(error, 'message')));
  }
}

export function* findTwoUserById(api, action) {
  const resPonse = yield call(api.findTwoUserById, action.payload);
  try {
    const data = yield configResponse(resPonse);
    yield put(actions.findTwoUserByIdSuccess(data));
  } catch (error) {
    yield put(actions.findTwoUserByIdFail(_.get(error, 'message')));
  }
}

export function* getListMessages(api, action) {
  const resPonse = yield call(api.getListMessages, action.payload);
  try {
    const data = yield configResponse(resPonse);
    yield put(actions.getListMessagesSuccess(data));
  } catch (error) {
    yield put(actions.getListMessagesFail(_.get(error, 'message')));
  }
}

export function* ChatAppSaga() {
  yield all([
    yield takeLatest(actions.getListUsers.type, getListUsers, chatApptRequest),
    yield takeLatest(actions.getUserById.type, getUserById, chatApptRequest),
    yield takeLatest(
      actions.getFriendById.type,
      getFriendById,
      chatApptRequest,
    ),
    yield takeLatest(
      actions.postNewMessage.type,
      postNewMessage,
      chatApptRequest,
    ),
    yield takeLatest(
      actions.convertStationMyFriend.type,
      convertStationMyFriend,
      chatApptRequest,
    ),
    yield takeLatest(
      actions.saveConvertStation.type,
      saveConvertStation,
      chatApptRequest,
    ),
    yield takeLatest(
      actions.convertStationByUserId.type,
      convertStationByUserId,
      chatApptRequest,
    ),
    yield takeLatest(
      actions.findTwoUserById.type,
      findTwoUserById,
      chatApptRequest,
    ),
    yield takeLatest(
      actions.getListMessages.type,
      getListMessages,
      chatApptRequest,
    ),
  ]);
}
