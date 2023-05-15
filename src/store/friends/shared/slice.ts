import { createSlice } from 'store/core/@reduxjs/toolkit';
import { Friends } from 'store/model/Friends.model';

export interface FriendsState {
  loading: boolean;
  success: any;
  error: any;
  friendById: Friends | null;
  listFriends: Friends[];
}

export const initialState: FriendsState = {
  loading: false,
  success: {},
  error: {},
  friendById: null,
  listFriends: [],
};

const FriendsSlice = createSlice({
  name: 'friends',
  initialState,
  reducers: {
    getListFriends(state) {
      state.loading = true;
    },
    getListFriendsSuccess(state, action) {
      state.loading = false;
      state.listFriends = action.payload.data;
    },
    getListFriendsFail(state, action) {
      state.loading = false;
    },

    addFriend(state, action) {
      state.loading = true;
    },
    addFriendSuccess(state, action) {
      state.loading = false;
    },
    addFriendFail(state, action) {
      state.loading = false;
    },

    clearListFriends(state) {
      state.listFriends = [];
    },

    clearData(state) {
      state.success = {};
      state.error = {};
      state.friendById = null;
      state.listFriends = [];
    },
  },
});

export const { actions, reducer, name: sliceKey } = FriendsSlice;
