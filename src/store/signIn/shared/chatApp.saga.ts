import { call, put, takeLatest, all } from 'redux-saga/effects';
import { ChatAppHttp } from 'store/signIn/service/chatApp.http';
import { configResponse } from 'store/services/request';
import { JOIN_ROOM } from '../constants/chatApp.const';

const chatAppRequest = new ChatAppHttp();

export function* postSignIn(api, action) {
  const resPonse = yield call(api.postSignIn, action.payload);
  try {
    const data = yield configResponse(resPonse);
  } catch (error) {}
}

export function* joinRoomSaga(data) {
  try {
    yield put({
      type: JOIN_ROOM,
      payload: data,
    });
  } catch (error) {
    console.log(error);
  }
}

export function* joinRoomSagaAction() {
  yield takeLatest(JOIN_ROOM, joinRoomSaga);
}
