import { combineReducers } from 'redux';
import { ChatAppReducer } from './signIn/shared/chatApp.reducer';

export const rootReducers = combineReducers({
  ChatAppReducer,
});
