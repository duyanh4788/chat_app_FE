import { call, put, takeLatest, all } from 'redux-saga/effects';
import { actions } from './slice';
import * as _ from 'lodash';
import { ListHttp } from '../service/list.http';
import { configResponse } from 'store/services/request';

const listRequest = new ListHttp();
export function* getListUsers(api, action) {
  const resPonse = yield call(api.getListUsers, action.payload);
  try {
    const data = yield configResponse(resPonse);
    yield put(actions.getListUsersSuccess(data));
  } catch (error) {
    yield put(actions.getListUsersFail(_.get(error, 'message')));
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

export function* ListSaga() {
  yield all([
    yield takeLatest(actions.getListUsers.type, getListUsers, listRequest),
    yield takeLatest(
      actions.getListMessages.type,
      getListMessages,
      listRequest,
    ),
  ]);
}
