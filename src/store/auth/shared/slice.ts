import { createSlice } from 'store/core/@reduxjs/toolkit';
import { REPONSE_CONSTANT, REPONSE_MESSAGE } from '../constants/auth.constant';

export interface AuthState {
  error?: any | null;
  success: any;
  loading: boolean;
}

export const initialState: AuthState = {
  loading: false,
  error: null,
  success: {},
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
      state.success = {
        key: REPONSE_CONSTANT.SIGN_IN_SUCCESS,
        message: REPONSE_MESSAGE.SIGN_IN_SUCCESS,
      };
    },
    sigInUserFail(state, action) {
      state.loading = false;
      state.error = {
        key: REPONSE_CONSTANT.SIGN_IN_FAIL,
        message: REPONSE_MESSAGE.SIGN_IN_FAIL,
      };
    },

    signUpUser(state, action) {
      state.loading = true;
    },
    signUpUserSuccess(state, action) {
      state.loading = false;
      state.success = {
        key: REPONSE_CONSTANT.SIGN_UP_SUCCESS,
        message: REPONSE_MESSAGE.SIGN_UP_SUCCESS,
      };
    },
    signUpUserFail(state, action) {
      state.loading = false;
      state.error = {
        key: REPONSE_CONSTANT.SIGN_UP_FAIL,
        message: REPONSE_MESSAGE.SIGN_UP_FAIL,
      };
    },

    stateSuccess(state) {
      state.loading = true;
    },
    stateError(state) {
      state.loading = false;
    },
  },
});

export const { actions, reducer, name: sliceKey } = AuthSlice;
