import { combineReducers } from '@reduxjs/toolkit';
import { InjectedReducersType } from 'store/core/types/injector-typings';

export function lastAction(state = null, action) {
  return action;
}

export function createReducer(injectedReducers: InjectedReducersType = {}) {
  if (Object.keys(injectedReducers).length === 0) {
    return state => state;
  } else {
    return combineReducers({
      ...injectedReducers,
      lastAction,
    });
  }
}
