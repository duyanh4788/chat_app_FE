import { JOIN_ROOM } from '../constants/chatApp.const';

export interface ChatAppState {
  joinRoom: any;
}

export const initialState: ChatAppState = {
  joinRoom: {},
};

export const ChatAppReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case JOIN_ROOM: {
      state.joinRoom = payload.data;
      return { ...state, ...payload };
    }
    default:
      return state;
  }
};
