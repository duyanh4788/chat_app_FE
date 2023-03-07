import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'store/core/types';
import { initialState } from './slice';

const selectChatApp = (state: RootState) => state?.chatapp || initialState;

export const selectLoading = createSelector(
  [selectChatApp],
  state => state.loading,
);

export const selectLoadingPaging = createSelector(
  [selectChatApp],
  state => state.loadingPaging,
);


export const selectListUsers = createSelector(
  [selectChatApp],
  state => state.listUsers,
);

export const selectConvertStation = createSelector(
  [selectChatApp],
  state => state.convertStation,
);

export const selectGetListMessages = createSelector(
  [selectChatApp],
  state => state.getListMessages,
);

export const selectUploadAWS = createSelector(
  [selectChatApp],
  state => state.uploadAWS,
);
