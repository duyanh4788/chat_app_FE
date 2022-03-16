/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { createContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import * as _ from 'lodash';
import * as ChatAppSlice from 'store/chatApp/shared/slice';
import * as ChatAppConst from 'store/chatApp/constants/chatapp.constant';
import * as ChatAppSelector from 'store/chatApp/shared/selectors';
import { ChatAppSaga } from 'store/chatApp/shared/saga';
import {
  useInjectReducer,
  useInjectSaga,
} from 'store/core/@reduxjs/redux-injectors';
import { LocalStorageService } from 'store/services/localStorage';
import { UserModel } from 'store/model/User.model';
import { openNotifi } from 'store/utils/Notification';

export const AuthContext = React.createContext({});
export const AuthContextProvider = ({ children }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const local = new LocalStorageService();
  const infoUser = local.getItem('_info');
  useInjectReducer({
    key: ChatAppSlice.sliceKey,
    reducer: ChatAppSlice.reducer,
  });
  useInjectSaga({
    key: ChatAppSlice.sliceKey,
    saga: ChatAppSaga,
  });
  const userById = useSelector(ChatAppSelector.selectUserById);

  useEffect(() => {
    function handleUser(user) {
      if (_.isEmpty(user)) {
        openNotifi(400, 'Vui lòng đăng nhập');
        return history.push('/');
      }
      if (!_.isEmpty(user)) {
        dispatch(ChatAppSlice.actions.getUserById(_.get(infoUser, 'id')));
        return history.push('/chatApp');
      }
    }
    handleUser(infoUser);
  }, []);

  return (
    <AuthContext.Provider value={userById}>{children}</AuthContext.Provider>
  );
};
