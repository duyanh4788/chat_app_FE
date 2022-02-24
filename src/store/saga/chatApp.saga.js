import { put, takeLatest } from '@redux-saga/core/effects'
import { JOIN_ROOM } from '../reducer/chatApp.const'

function* joinRoomSaga(data) {
  try {
    yield put({
      type: JOIN_ROOM,
      payload: data,
    })
  } catch (error) {
    console.log(error)
  }
}

export function* joinRoomSagaAction() {
  yield takeLatest('joinRoomSaga', joinRoomSaga)
}
