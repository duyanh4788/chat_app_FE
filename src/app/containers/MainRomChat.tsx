/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import * as _ from 'lodash';
import * as AuthSelector from 'store/auth/shared/selectors';
import * as AuthSlice from 'store/auth/shared/slice';
import * as AuthConst from 'store/auth/constants/auth.constant';
import { useLocation, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Tabs } from 'antd';
import { AppLoading } from 'store/utils/Apploading';
import { SignUpUser } from '../components/SignUpUser';
import { SignInUser } from '../components/SignInUser';
import { Unsubscribe } from 'redux';
import { RootStore } from 'store/configStore';
import { openNotifi } from 'store/utils/Notification';
import { LocalStorageService } from 'store/services/localStorage';
import { TOKEN_EXPRIED } from 'store/commom/common.contants';

const { TabPane } = Tabs;

export const MainRomChat = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const local = new LocalStorageService();
  const loading = useSelector(AuthSelector.selectLoading);
  const [tabsPanel, setTabsPanel] = useState<string>('1');
  const location = useLocation();

  useEffect(() => {
    function initUrl() {
      const searchParams = new URLSearchParams(location.search);
      const getUrlToken = searchParams.get('token');
      if (getUrlToken) {
        const toKen = getUrlToken?.split('?_id=')[0];
        const id = getUrlToken?.split('?_id=')[1];
        if (toKen && id) {
          local.setAuth({
            toKen,
            id,
          });
          history.push('/chatApp');
          window.location.reload();
        }
        return;
      }
      const getUrlAuthCode = searchParams.get('authCode');
      if (getUrlAuthCode) {
        dispatch(AuthSlice.actions.activeAuthCode(getUrlAuthCode));
        const { href } = window.location;
        const url = new URL(href);
        url.searchParams.delete('authCode');
        window.history.replaceState(null, '', url as unknown as string);
        return;
      }
    }
    initUrl();
  }, [location]);

  useEffect(() => {
    const storeSub$: Unsubscribe = RootStore.subscribe(() => {
      const { type, payload } = RootStore.getState().lastAction;
      if (payload === TOKEN_EXPRIED) {
        openNotifi(400, payload);
        return;
      }
      switch (type) {
        case AuthSlice.actions.signUpUserSuccess.type:
          setTabsPanel('1');
          openNotifi(200, AuthConst.REPONSE_MESSAGE.SIGN_UP_SUCCESS);
          break;
        case AuthSlice.actions.activeAuthCodeSuccess.type:
          setTabsPanel('1');
          openNotifi(200, payload);
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
        case AuthSlice.actions.activeAuthCodeFail.type:
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
