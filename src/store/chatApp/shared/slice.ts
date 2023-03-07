import { createSlice } from 'store/core/@reduxjs/toolkit';

export interface ChatAppState {
  loading: boolean;
  listUsers: any;
  convertStation: any;
  listMessages: any;
  uploadAWS: any;
}

export const initialState: ChatAppState = {
  loading: false,
  listUsers: {},
  convertStation: null,
  listMessages: {},
  uploadAWS: {},
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

    getListMessages(state, action) {
      state.loading = true;
    },
    getListMessagesSuccess(state, action) {
      state.loading = false;
      state.listMessages = action.payload;
    },
    getListMessagesFail(state, action) {
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

    saveConvertStation(state, action) {
      state.loading = true;
    },
    saveConvertStationSuccess(state, action) {
      state.loading = false;
      state.convertStation = action.payload;
    },
    saveConvertStationFail(state, action) {
      state.loading = false;
    },

    changeStatusoffline(state, action) {
      state.loading = true;
    },
    changeStatusofflineSuccess(state, action) {
      state.loading = false;
    },
    changeStatusofflineFail(state, action) {
      state.loading = false;
    },

    postUploadAWS3(state, action) {
      state.loading = true;
    },
    postUploadAWS3Success(state, action) {
      state.loading = false;
      state.uploadAWS = action.payload;
    },
    postUploadAWS3Fail(state, action) {
      state.loading = false;
    },

    clearUploadAWS3(state) {
      state.uploadAWS = {};
    },

    clearData(state) {
      state.loading = false;
      state.listUsers = {};
      state.convertStation = {};
      state.listMessages = {};
      state.uploadAWS = {};
    },
  },
});

export const { actions, reducer, name: sliceKey } = ChatAppSlice;
