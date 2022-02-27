import { all } from 'redux-saga/effects';
import { joinRoomSagaAction } from './signIn/shared/chatApp.saga';

export function* rootSaga() {
  yield all([joinRoomSagaAction()]);
}
