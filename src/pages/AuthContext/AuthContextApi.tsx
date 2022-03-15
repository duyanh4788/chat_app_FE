/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { createContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import * as _ from 'lodash';
import * as AuthSlice from 'store/auth/shared/slice';
import { AuthSaga } from 'store/auth/shared/saga';
import { Unsubscribe } from 'redux';
import {
  useInjectReducer,
  useInjectSaga,
} from 'store/core/@reduxjs/redux-injectors';

export const AuthContextApi = ({ children, values }) => {};
