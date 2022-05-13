/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import * as _ from 'lodash';
import * as AuthSlice from 'store/auth/shared/slice';
import * as AuthSelector from 'store/auth/shared/selectors';
import { AuthSaga } from 'store/auth/shared/saga';
import {
  useInjectReducer,
  useInjectSaga,
} from 'store/core/@reduxjs/redux-injectors';
import { LocalStorageService } from 'store/services/localStorage';
import { openNotifi } from 'store/utils/Notification';

export const AuthContext = React.createContext({});
export const AuthContextProvider = ({ children }) => {
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const local = new LocalStorageService();
  const infoUser = local.getItem('_info');

  useInjectReducer({
    key: AuthSlice.sliceKey,
    reducer: AuthSlice.reducer,
  });
  useInjectSaga({
    key: AuthSlice.sliceKey,
    saga: AuthSaga,
  });
  const userById = useSelector(AuthSelector.selectUserById);

  useEffect(() => {
    function handleUser(user) {
      if (_.isEmpty(user) && location.pathname === '/chatApp') {
        openNotifi(400, 'Vui lòng đăng nhập');
        return history.push('/');
      }
      if (!_.isEmpty(user)) {
        dispatch(AuthSlice.actions.getUserById(_.get(user, 'id')));
        return;
      }
    }
    handleUser(infoUser);
  }, []);
  return (
    <AuthContext.Provider value={userById}>{children}</AuthContext.Provider>
  );
};
