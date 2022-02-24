import { all } from 'redux-saga/effects'
import { joinRoomSagaAction } from './chatApp.saga'

export function* rootSaga() {
  yield all([joinRoomSagaAction()])
}
