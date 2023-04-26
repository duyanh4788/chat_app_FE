import { createSlice } from 'store/core/@reduxjs/toolkit';
import { Users } from 'store/model/Users.model';

export interface AuthState {
  loading: boolean;
  success: any;
  error: any;
  userById: Users;
  authPair: string | null;
}

export const initialState: AuthState = {
  loading: false,
  success: {},
  error: {},
  userById: {},
  authPair: null,
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

    sigInUserWithApp(state, action) {
      state.loading = true;
    },
    sigInUserWithAppSuccess(state, action) {
      state.loading = false;
      state.userById = action.payload.data;
    },
    sigInUserWithAppFail(state, action) {
      state.loading = false;
    },

    signUpUser(state, action) {
      state.loading = true;
    },
    signUpUserSuccess(state, action) {
      state.loading = false;
      state.success = action.payload;
    },
    signUpUserFail(state, action) {
      state.loading = false;
    },

    activeAuthCode(state, action) {
      state.loading = true;
    },
    activeAuthCodeSuccess(state, action) {
      state.loading = false;
      state.success = action.payload;
    },
    activeAuthCodeFail(state, action) {
      state.loading = false;
    },

    forgotPassword(state, action) {
      state.loading = true;
    },
    forgotPasswordSuccess(state, action) {
      state.loading = false;
      state.success = action.payload;
    },
    forgotPasswordFail(state, action) {
      state.loading = false;
    },

    resetPassword(state, action) {
      state.loading = true;
    },
    resetPasswordSuccess(state, action) {
      state.loading = false;
      state.success = action.payload;
    },
    resetPasswordFail(state, action) {
      state.loading = false;
    },

    resendOrderForgotPassword(state, action) {
      state.loading = true;
    },
    resendOrderForgotPasswordSuccess(state, action) {
      state.loading = false;
      state.success = action.payload;
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

    getAuthPair(state, action) {
      state.loading = true;
    },
    getAuthPairSuccess(state, action) {
      state.loading = false;
      state.authPair = action.payload.data;
    },
    getAuthPairFail(state, action) {
      state.loading = false;
    },

    pairAuth(state, action) {
      state.loading = true;
    },
    pairAuthSuccess(state, action) {
      state.loading = false;
    },
    pairAuthFail(state, action) {
      state.loading = false;
    },

    clearCode(state) {
      state.authPair = null;
    },

    clearData(state) {
      state.success = {};
      state.error = {};
      state.authPair = null;
    },
  },
});

export const { actions, reducer, name: sliceKey } = AuthSlice;
