/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react';
import * as AuthSelector from 'store/auth/shared/selectors';
import * as AuthSlice from 'store/auth/shared/slice';
import * as _ from 'lodash';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Tabs } from 'antd';
import { AppLoading } from 'store/utils/Apploading';
import { SignUpUser } from './authuser/SignUpUser';
import { SignInUser } from './authuser/SignInUser';
import { Unsubscribe } from 'redux';
import { RootStore } from 'store/configStore';
import { openNotificationJoin } from 'store/utils/Notification';
import { LocalStorageService } from 'store/services/localStorage';

const { TabPane } = Tabs;

function callback(key) {}

export const MainRomChat = () => {
  const history = useHistory();
  const local = new LocalStorageService();
  const loading = useSelector(AuthSelector.selectLoading);

  useEffect(() => {
    const storeSub$: Unsubscribe = RootStore.subscribe(() => {
      const { type, payload } = RootStore.getState().lastAction;
      switch (type) {
        case AuthSlice.actions.sigInUserSuccess.type:
          local.setLocalUser(_.get(payload, 'info'));
          openNotificationJoin(
            _.get(payload, 'code'),
            _.get(payload, 'message'),
          );
          history.push('/chatApp');
          break;
        case AuthSlice.actions.sigInUserFail.type:
          openNotificationJoin(400, payload);
          break;
        case AuthSlice.actions.signUpUserSuccess.type:
          callback('2');
          openNotificationJoin(
            _.get(payload, 'code'),
            _.get(payload, 'message'),
          );
          break;
        case AuthSlice.actions.signUpUserFail.type:
          openNotificationJoin(400, payload);
          break;
        default:
          break;
      }
    });
    return () => {
      storeSub$();
    };
  }, []);
  return (
    <div className="main_form">
      {loading && <AppLoading loading />}
      <div>
        <h1>Room Chat Lẩu Xanh</h1>
        <Tabs defaultActiveKey="1" onChange={callback}>
          <TabPane tab={<p>Đăng nhập</p>} key="1">
            <SignInUser />
          </TabPane>
          <TabPane tab={<p>Đăng ký</p>} key="2">
            <SignUpUser />
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};
