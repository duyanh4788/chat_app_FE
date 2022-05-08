import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'store/core/types';
import { initialState } from './slice';

const selectAuth = (state: RootState) => state?.auth || initialState;

export const selectLoading = createSelector(
  [selectAuth],
  state => state.loading,
);

export const selectSuccess = createSelector(
  [selectAuth],
  state => state.success,
);

export const selectUserById = createSelector(
  [selectAuth],
  state => state.userById,
);
