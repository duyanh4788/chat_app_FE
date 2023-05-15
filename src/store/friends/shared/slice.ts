import { createSlice } from 'store/core/@reduxjs/toolkit';
import { Friends } from 'store/model/Friends.model';

export interface FriendsState {
  loading: boolean;
  success: boolean;
  error: any;
  friendById: Friends | null;
  listFriends: Friends[];
}

export const initialState: FriendsState = {
  loading: false,
  success: false,
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
      state.success = true;
    },
    addFriendFail(state, action) {
      state.loading = false;
    },

    acceptFriends(state, action) {
      state.loading = true;
    },
    acceptFriendsSuccess(state, action) {
      state.loading = false;
      state.success = true;
    },
    acceptFriendsFail(state, action) {
      state.loading = false;
    },

    declineFriends(state, action) {
      state.loading = true;
    },
    declineFriendsSuccess(state, action) {
      state.loading = false;
      state.success = true;
    },
    declineFriendsFail(state, action) {
      state.loading = false;
    },

    clearListFriends(state) {
      state.listFriends = [];
    },

    clearSuccess(state) {
      state.success = false;
    },

    clearData(state) {
      state.success = false;
      state.error = {};
      state.friendById = null;
      state.listFriends = [];
    },
  },
});

export const { actions, reducer, name: sliceKey } = FriendsSlice;
