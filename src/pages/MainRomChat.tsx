/* eslint-disable no-unused-vars */
import React from 'react';
import * as AuthSelector from 'store/auth/shared/selectors';
import { useSelector } from 'react-redux';
import { Tabs } from 'antd';
import { AppLoading } from 'store/utils/Apploading';
import { SignUpUser } from './authuser/SignUpUser';
import { SignInUser } from './authuser/SignInUser';

const { TabPane } = Tabs;

function callback(key) {}

export const MainRomChat = () => {
  const loading = useSelector(AuthSelector.selectLoading);
  return (
    <div className="main_form">
      {loading && <AppLoading loading />}
      <div>
        <h1>Room Chat Lẩu Xanh</h1>
        <Tabs defaultActiveKey="1" onChange={callback}>
          <TabPane tab={<p>Đăng ký</p>} key="1">
            <SignUpUser />
          </TabPane>
          <TabPane tab={<p>Đăng nhập</p>} key="2">
            <SignInUser />
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};
