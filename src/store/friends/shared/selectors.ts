import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'store/core/types';
import { initialState } from './slice';

const selectFriends = (state: RootState) => state?.friends || initialState;

export const selectLoading = createSelector([selectFriends], state => state.loading);

export const selectSuccess = createSelector([selectFriends], state => state.success);

export const selectFriendById = createSelector([selectFriends], state => state.friendById);

export const selectListFriends = createSelector([selectFriends], state => state.listFriends);
