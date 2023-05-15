import { call, put, takeLatest, all } from 'redux-saga/effects';
import { actions } from './slice';
import { configResponse, configResponseError } from 'store/services/request';
import { FriendsHttp } from '../service/friends.http';

export function* addFriend(api, action) {
  const resPonse = yield call(api.addFriend, action.payload);
  try {
    const data = yield configResponse(resPonse);
    yield put(actions.addFriendSuccess(data));
  } catch (error) {
    yield put(actions.addFriendFail(configResponseError(error)));
  }
}

export function* getListFriends(api, action) {
  const resPonse = yield call(api.getListFriends, action.payload);
  try {
    const data = yield configResponse(resPonse);
    yield put(actions.getListFriendsSuccess(data));
  } catch (error) {
    yield put(actions.getListFriendsFail(configResponseError(error)));
  }
}

export function* acceptFriends(api, action) {
  const resPonse = yield call(api.acceptFriends, action.payload);
  try {
    const data = yield configResponse(resPonse);
    yield put(actions.acceptFriendsSuccess(data));
  } catch (error) {
    yield put(actions.acceptFriendsFail(configResponseError(error)));
  }
}

export function* declineFriends(api, action) {
  const resPonse = yield call(api.declineFriends, action.payload);
  try {
    const data = yield configResponse(resPonse);
    yield put(actions.declineFriendsSuccess(data));
  } catch (error) {
    yield put(actions.declineFriendsFail(configResponseError(error)));
  }
}

export function* FriendsSaga() {
  const friendsRequest = new FriendsHttp();
  yield all([
    yield takeLatest(actions.addFriend.type, addFriend, friendsRequest),
    yield takeLatest(actions.getListFriends.type, getListFriends, friendsRequest),
    yield takeLatest(actions.acceptFriends.type, acceptFriends, friendsRequest),
    yield takeLatest(actions.declineFriends.type, declineFriends, friendsRequest),
  ]);
}
