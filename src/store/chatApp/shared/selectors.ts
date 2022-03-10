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

export const selectUserById = createSelector(
  [selectChatApp],
  state => state.userById,
);

export const selectConvertStation = createSelector(
  [selectChatApp],
  state => state.convertStation,
);

export const selectFriendById = createSelector(
  [selectChatApp],
  state => state.friendById,
);

export const selectConvertStationMyFriend = createSelector(
  [selectChatApp],
  state => state.convertStationMyFriend,
);

export const selectConvertStationByUserId = createSelector(
  [selectChatApp],
  state => state.convertStationByUserId,
);

export const selectFindTwoUserById = createSelector(
  [selectChatApp],
  state => state.findTwoUserById,
);

export const selectListMessages = createSelector(
  [selectChatApp],
  state => state.listMessages,
);
