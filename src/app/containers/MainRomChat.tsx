/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import * as _ from 'lodash';
import * as AuthSelector from 'store/auth/shared/selectors';
import * as AuthSlice from 'store/auth/shared/slice';
import * as AuthConst from 'store/auth/constants/auth.constant';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Tabs } from 'antd';
import { AppLoading } from 'store/utils/Apploading';
import { SignUpUser } from '../components/SignUpUser';
import { SignInUser } from '../components/SignInUser';
import { Unsubscribe } from 'redux';
import { RootStore } from 'store/configStore';
import { openNotifi } from 'store/utils/Notification';
import { LocalStorageService } from 'store/services/localStorage';

const { TabPane } = Tabs;

export const MainRomChat = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const local = new LocalStorageService();
  const loading = useSelector(AuthSelector.selectLoading);
  const [tabsPanel, setTabsPanel] = useState<string>('1');
  useEffect(() => {
    const storeSub$: Unsubscribe = RootStore.subscribe(() => {
      const { type, payload } = RootStore.getState().lastAction;
      switch (type) {
        case AuthSlice.actions.signUpUserSuccess.type:
          setTabsPanel('1');
          openNotifi(200, AuthConst.REPONSE_MESSAGE.SIGN_UP_SUCCESS);
          break;
        case AuthSlice.actions.sigInUserSuccess.type:
          local.setAuth({
            toKen: _.get(payload, 'toKen'),
            id: _.get(payload, '_id'),
          });
          openNotifi(200, AuthConst.REPONSE_MESSAGE.SIGN_IN_SUCCESS);
          dispatch(
            AuthSlice.actions.changeStatusOnline({
              id: _.get(payload, '_id'),
            }),
          );
          break;
        case AuthSlice.actions.changeStatusOnlineSuccess.type:
          history.push('/chatApp');
          break;
        case AuthSlice.actions.signUpUserFail.type:
          openNotifi(400, payload);
          break;
        case AuthSlice.actions.sigInUserFail.type:
          openNotifi(400, payload);
          break;
        case AuthSlice.actions.changeStatusOnlineFail.type:
          openNotifi(400, payload);
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
        <h1>Chat App</h1>
        <Tabs activeKey={tabsPanel} centered onChange={e => setTabsPanel(e)}>
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
