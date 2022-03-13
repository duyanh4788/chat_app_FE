import { createSlice } from 'store/core/@reduxjs/toolkit';

export interface AuthState {
  loading: boolean;
  success: boolean;
  error: any;
}

export const initialState: AuthState = {
  loading: false,
  success: false,
  error: {},
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
    },
    sigInUserFail(state, action) {
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
  },
});

export const { actions, reducer, name: sliceKey } = AuthSlice;
