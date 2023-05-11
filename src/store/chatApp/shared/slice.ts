import { createSlice } from 'store/core/@reduxjs/toolkit';
import { ConvertStations, ListMessages } from 'store/model/ChatApp.model';
import { Users } from 'store/model/Users.model';

export interface ChatAppState {
  loading: boolean;
  loadingImage: boolean;
  loadingPaging: boolean;
  listUsers: Users[];
  convertStation: ConvertStations | undefined;
  getListMessages: ListMessages | any;
  uploadAWS: any;
}

export const initialState: ChatAppState = {
  loading: false,
  loadingImage: false,
  loadingPaging: false,
  listUsers: [],
  convertStation: undefined,
  getListMessages: {},
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
      state.listUsers = action.payload.data;
    },
    getListUsersFail(state, action) {
      state.loading = false;
    },

    searchUsers(state, action) {},
    searchUsersSuccess(state, action) {
      state.listUsers = action.payload.data;
    },
    searchUsersFail(state, action) {},

    getListMessages(state, action) {
      state.loadingPaging = true;
    },
    getListMessagesSuccess(state, action) {
      state.loadingPaging = false;
      state.getListMessages = action.payload.data;
    },
    getListMessagesFail(state, action) {
      state.loadingPaging = false;
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
      state.convertStation = action.payload.data;
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
      state.loadingImage = true;
    },
    postUploadAWS3Success(state, action) {
      state.loadingImage = false;
      state.uploadAWS = action.payload.data;
    },
    postUploadAWS3Fail(state, action) {
      state.loadingImage = false;
    },

    removeUploadAWS3(state, action) {
      state.loading = true;
    },
    removeUploadAWS3Success(state, action) {
      state.loading = false;
    },
    removeUploadAWS3Fail(state, action) {
      state.loading = false;
    },

    clearUploadAWS3(state) {
      state.uploadAWS = {};
    },

    clearData(state) {
      state.loading = false;
      state.loadingPaging = false;
      state.listUsers = [];
      state.convertStation = undefined;
      state.getListMessages = {};
      state.uploadAWS = {};
    },
  },
});

export const { actions, reducer, name: sliceKey } = ChatAppSlice;
