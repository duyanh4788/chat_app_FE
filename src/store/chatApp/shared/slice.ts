import { createSlice } from 'store/core/@reduxjs/toolkit';

export interface ChatAppState {
  loading: boolean;
  listUsers: any;
  userById: any;
  friendById: any;
  listMessages: any;
  convertStationMyFriend: any;
  convertStationByUserId: any;
  findTwoUserById: any;
}

export const initialState: ChatAppState = {
  loading: false,
  listUsers: {},
  convertStationMyFriend: null,

  userById: {},
  friendById: {},
  listMessages: {},
  convertStationByUserId: {},
  findTwoUserById: {},
};

const ChatAppSlice = createSlice({
  name: 'chatapp',
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

    postNewMessage(state, action) {
      state.loading = true;
    },
    postNewMessageSuccess(state, action) {
      state.loading = false;
    },
    postNewMessageFail(state, action) {
      state.loading = false;
    },

    convertStationMyFriend(state, action) {
      state.loading = true;
    },
    convertStationMyFriendSuccess(state, action) {
      state.loading = false;
      state.convertStationMyFriend = action.payload.data;
    },
    convertStationMyFriendFail(state, action) {
      state.loading = false;
    },

    // ======================================================= //

    getUserById(state) {
      state.loading = true;
    },
    getUserByIdSuccess(state, action) {
      state.loading = false;
      state.userById = action.payload;
    },
    getUserByIdFail(state, action) {
      state.loading = false;
    },

    getFriendById(state) {
      state.loading = true;
    },
    getFriendByIdSuccess(state, action) {
      state.loading = false;
      state.friendById = action.payload;
    },
    getFriendByIdFail(state, action) {
      state.loading = false;
    },

    saveConvertStation(state, action) {
      state.loading = true;
    },
    saveConvertStationSuccess(state, action) {
      state.loading = false;
    },
    saveConvertStationFail(state, action) {
      state.loading = false;
    },

    convertStationByUserId(state) {
      state.loading = true;
    },
    convertStationByUserIdSuccess(state, action) {
      state.loading = false;
      state.convertStationByUserId = action.payload;
    },
    convertStationByUserIdFail(state, action) {
      state.loading = false;
    },

    findTwoUserById(state) {
      state.loading = true;
    },
    findTwoUserByIdSuccess(state, action) {
      state.loading = false;
      state.findTwoUserById = action.payload;
    },
    findTwoUserByIdFail(state, action) {
      state.loading = false;
    },

    getListMessages(state) {
      state.loading = true;
    },
    getListMessagesSuccess(state, action) {
      state.loading = false;
      state.listMessages = action.payload;
    },
    getListMessagesFail(state, action) {
      state.loading = false;
    },

    clearData(state) {
      state.listUsers = {};
      state.listMessages = {};
      state.userById = {};
      state.friendById = {};
      state.convertStationMyFriend = {};
      state.convertStationByUserId = {};
      state.findTwoUserById = {};
    },
  },
});

export const { actions, reducer, name: sliceKey } = ChatAppSlice;
