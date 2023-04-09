import { createSlice } from 'store/core/@reduxjs/toolkit';
import { Users } from 'store/model/Users.model';

export interface AuthState {
  loading: boolean;
  success: any;
  error: any;
  userById: Users;
}

export const initialState: AuthState = {
  loading: false,
  success: {},
  error: {},
  userById: {},
};

const AuthSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    sigInUser(state, action) {
      state.loading = true;
    },
    sigInUserSuccess(state, action) {
      state.loading = false;
      state.userById = action.payload.data;
    },
    sigInUserFail(state, action) {
      state.loading = false;
    },

    sigInUserWithCode(state, action) {
      state.loading = true;
    },
    sigInUserWithCodeSuccess(state, action) {
      state.loading = false;
      state.userById = action.payload.data;
    },
    sigInUserWithCodeFail(state, action) {
      state.loading = false;
    },

    signUpUser(state, action) {
      state.loading = true;
    },
    signUpUserSuccess(state, action) {
      state.loading = false;
      state.success = action.payload.message;
    },
    signUpUserFail(state, action) {
      state.loading = false;
    },

    activeAuthCode(state, action) {
      state.loading = true;
    },
    activeAuthCodeSuccess(state, action) {
      state.loading = false;
      state.success = action.payload.message;
    },
    activeAuthCodeFail(state, action) {
      state.loading = false;
    },

    forgotPassword(state, action) {
      state.loading = true;
    },
    forgotPasswordSuccess(state, action) {
      state.loading = false;
      state.success = action.payload.message;
    },
    forgotPasswordFail(state, action) {
      state.loading = false;
    },

    resetPassword(state, action) {
      state.loading = true;
    },
    resetPasswordSuccess(state, action) {
      state.loading = false;
      state.success = action.payload.message;
    },
    resetPasswordFail(state, action) {
      state.loading = false;
    },

    resendOrderForgotPassword(state, action) {
      state.loading = true;
    },
    resendOrderForgotPasswordSuccess(state, action) {
      state.loading = false;
      state.success = action.payload.message;
    },
    resendOrderForgotPasswordFail(state, action) {
      state.loading = false;
    },

    signUpWithFB(state, action) {
      state.loading = true;
    },
    signUpWithFBSuccess(state, action) {
      state.loading = false;
    },
    signUpWithFBFail(state, action) {
      state.loading = false;
    },

    signUpWithGG(state, action) {
      state.loading = true;
    },
    signUpWithGGSuccess(state, action) {
      state.loading = false;
    },
    signUpWithGGFail(state, action) {
      state.loading = false;
    },

    getUserById(state, action) {
      state.loading = true;
    },
    getUserByIdSuccess(state, action) {
      state.loading = false;
      state.userById = action.payload.data;
    },
    getUserByIdFail(state, action) {
      state.loading = false;
    },

    changeStatusOnline(state, action) {
      state.loading = true;
    },
    changeStatusOnlineSuccess(state, action) {
      state.loading = false;
    },
    changeStatusOnlineFail(state, action) {
      state.loading = false;
    },

    updateInfo(state, action) {
      state.loading = true;
    },
    updateInfoSuccess(state, action) {
      state.loading = false;
    },
    updateInfoFail(state, action) {
      state.loading = false;
    },

    clearData(state) {
      state.success = {};
      state.error = {};
    },
  },
});

export const { actions, reducer, name: sliceKey } = AuthSlice;
