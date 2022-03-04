import { createSlice } from 'store/core/@reduxjs/toolkit';

export interface ListState {
  loading: boolean;
  listUsers: any;
  listMessage: any;
}

export const initialState: ListState = {
  loading: false,
  listUsers: {},
  listMessage: {},
};

const ListSlice = createSlice({
  name: 'list',
  initialState,
  reducers: {
    getListUsers(state) {
      state.loading = true;
    },
    getListUsersSuccess(state, action) {
      state.loading = false;
      state.listUsers = action.payload;
    },
    getListUsersFail(state, action) {
      state.loading = false;
    },

    getListMessages(state) {
      state.loading = true;
    },
    getListMessagesSuccess(state, action) {
      state.loading = false;
      state.listMessage = action.payload;
    },
    getListMessagesFail(state, action) {
      state.loading = false;
    },

    clearListUser(state) {
      state.listUsers = {};
    },

    clearListMessage(state) {
      state.listMessage = {};
    },
  },
});

export const { actions, reducer, name: sliceKey } = ListSlice;
