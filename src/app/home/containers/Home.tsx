/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import * as _ from 'lodash';
import * as AuthSelector from 'store/auth/shared/selectors';
import * as AuthSlice from 'store/auth/shared/slice';
import { useLocation, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Input, Tabs, Tooltip } from 'antd';
import { CodeOutlined, RollbackOutlined } from '@ant-design/icons';
import { AppLoading } from 'store/utils/Apploading';
import { SignUpUser } from '../component/SignUpUser';
import { SignInUser } from '../component/SignInUser';
import { Unsubscribe } from 'redux';
import { RootStore } from 'store/configStore';
import { openNotifi } from 'store/utils/Notification';
import { LocalStorageService } from 'store/services/localStorage';

const { TabPane } = Tabs;

export const Home = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const local = new LocalStorageService();
  const loading = useSelector(AuthSelector.selectLoading);
  const [tabsPanel, setTabsPanel] = useState<string>('1');
  const [fromAuth, setFromAuth] = useState<boolean>(false);
  const [typeAuth, setTypeAuth] = useState<number>(0);
  const location = useLocation();

  useEffect(() => {
    function initUrl() {
      const searchParams = new URLSearchParams(location.search);
      const getUrlToken = searchParams.get('token');
      if (getUrlToken) {
        const toKen = getUrlToken?.split('?_id=')[0];
        const id = getUrlToken?.split('?_id=')[1];
        if (toKen && id) {
          local.setAuth({ toKen, id });
          dispatch(AuthSlice.actions.getUserById({ id }));
          history.push('/chatApp');
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
      if (!payload) return;
      const { data, message, code } = payload;
      switch (type) {
        case AuthSlice.actions.signUpUserSuccess.type:
          setTabsPanel('1');
          openNotifi(200, message);
          break;
        case AuthSlice.actions.activeAuthCodeSuccess.type:
          setTabsPanel('1');
          openNotifi(200, message);
          break;
        case AuthSlice.actions.sigInUserSuccess.type:
        case AuthSlice.actions.sigInUserWithCodeSuccess.type:
          handleLogin(data, message, code);
          break;
        case AuthSlice.actions.signUpWithFBSuccess.type:
        case AuthSlice.actions.signUpWithGGSuccess.type:
          window.location.href = data;
          break;
        case AuthSlice.actions.signUpUserFail.type:
        case AuthSlice.actions.signUpWithFBFail.type:
        case AuthSlice.actions.sigInUserFail.type:
        case AuthSlice.actions.sigInUserWithCodeFail.type:
        case AuthSlice.actions.activeAuthCodeFail.type:
          openNotifi(400, message);
          break;
        default:
          break;
      }
    });
    return () => {
      storeSub$();
    };
  }, []);

  const handleLogin = (data: any, message: string, code: number) => {
    switch (code) {
      case 200:
        local.setAuth({
          toKen: _.get(data, 'toKen'),
          id: _.get(data, '_id'),
        });
        history.push('/chatApp');
        break;
      case 201:
      case 202:
      case 203:
        openNotifi(code, message);
        setFromAuth(true);
        if (code === 201 || code === 202) {
          setTypeAuth(code);
        }
        break;
      default:
        break;
    }
  };

  const handleLoginWithCode = e => {
    if (e.target.value.length === 6 && typeAuth === 201) {
      dispatch(AuthSlice.actions.sigInUserWithCode({ authCode: e.target.value }));
      return;
    }
    if (e.target.value.length === 6 && typeAuth === 202) {
      dispatch(AuthSlice.actions.sigInUserWithApp({ otp: e.target.value }));
      return;
    }
  };

  return (
    <div className="main_form">
      {loading && <AppLoading loading />}
      <div>
        <h1>Chat App</h1>
        {fromAuth ? (
          <div className="form_input form_auth">
            <div style={{ width: '100%' }}>
              <Input
                prefix={<CodeOutlined className="site-form-item-icon" />}
                placeholder={'input code.'}
                onChange={handleLoginWithCode}
              />
              <div style={{ textAlign: 'center', marginTop: '10px' }}>
                <Tooltip title="home">
                  <RollbackOutlined onClick={() => setFromAuth(false)} />
                </Tooltip>
              </div>
            </div>
          </div>
        ) : (
          <Tabs activeKey={tabsPanel} centered onChange={e => setTabsPanel(e)}>
            <TabPane tab={<p>SignIn</p>} key="1">
              <SignInUser setFromAuth={setFromAuth} />
            </TabPane>
            <TabPane tab={<p>SingUp</p>} key="2">
              <SignUpUser />
            </TabPane>
          </Tabs>
        )}
      </div>
    </div>
  );
};
