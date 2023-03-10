/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import * as _ from 'lodash';
import * as AuthSelector from 'store/auth/shared/selectors';
import * as AuthSlice from 'store/auth/shared/slice';
import * as AuthConst from 'store/auth/constants/auth.constant';
import { useLocation, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
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
  const local = new LocalStorageService();
  const loading = useSelector(AuthSelector.selectLoading);
  const [tabsPanel, setTabsPanel] = useState<string>('1');
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const getUrl = searchParams.get('token');
    const toKen = getUrl?.split('?_id=')[0];
    const id = getUrl?.split('?_id=')[1];

    if (toKen && id) {
      local.setAuth({
        toKen,
        id,
      });
      history.push('/chatApp');
      window.location.reload();
    }
  }, [location]);

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
          history.push('/chatApp');
          window.location.reload();
          break;
        case AuthSlice.actions.signUpWithFBSuccess.type:
        case AuthSlice.actions.signUpWithGGSuccess.type:
          window.location.href = payload;
          break;
        case AuthSlice.actions.signUpUserFail.type:
        case AuthSlice.actions.signUpWithFBFail.type:
          openNotifi(400, payload);
          break;
        case AuthSlice.actions.sigInUserFail.type:
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
          <TabPane tab={<p>SignIn</p>} key="1">
            <SignInUser />
          </TabPane>
          <TabPane tab={<p>SingUp</p>} key="2">
            <SignUpUser />
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};
