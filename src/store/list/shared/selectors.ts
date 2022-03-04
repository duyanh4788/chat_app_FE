import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'store/core/types';
import { initialState } from './slice';

const selectList = (state: RootState) => state?.list || initialState;

export const selectLoading = createSelector(
  [selectList],
  state => state.loading,
);
