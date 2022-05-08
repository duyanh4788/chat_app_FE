import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'store/core/types';
import { initialState } from './slice';

const selectChatApp = (state: RootState) => state?.chatapp || initialState;

export const selectLoading = createSelector(
  [selectChatApp],
  state => state.loading,
);

export const selectListUsers = createSelector(
  [selectChatApp],
  state => state.listUsers,
);

export const selectConvertStation = createSelector(
  [selectChatApp],
  state => state.convertStation,
);

export const selectListMessages = createSelector(
  [selectChatApp],
  state => state.listMessages,
);
