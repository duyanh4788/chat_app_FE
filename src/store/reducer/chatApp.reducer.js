import { JOIN_ROOM } from './chatApp.const';

const initialState = {
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
