import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'store/core/types';
import { initialState } from './slice';

const selectAuth = (state: RootState) => state?.auth || initialState;

export const selectLoading = createSelector(
  [selectAuth],
  state => state.loading,
);

export const selectError = createSelector([selectAuth], state => state.error);

export const selectSuccess = createSelector(
  [selectAuth],
  state => state.success,
);
