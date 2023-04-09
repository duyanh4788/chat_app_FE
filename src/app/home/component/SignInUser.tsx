/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { useDispatch } from 'react-redux';
import * as _ from 'lodash';
import * as AuthSlice from 'store/auth/shared/slice';
import { AuthSaga } from 'store/auth/shared/saga';
import { useInjectReducer, useInjectSaga } from 'store/core/@reduxjs/redux-injectors';
import { Form, Input, Button, Tooltip, Typography } from 'antd';
import { UserOutlined, LockOutlined, CheckCircleTwoTone } from '@ant-design/icons';
import logo from '../../../images/logo.png';
import { LocalStorageService } from 'store/services/localStorage';
import { openNotifi } from 'store/utils/Notification';

interface Props {
  setFromAuth: (isBol: boolean) => void;
}

export function SignInUser({ setFromAuth }: Props) {
  const local = new LocalStorageService();
  const userInfor = local.getItem('_info');
  useInjectReducer({
    key: AuthSlice.sliceKey,
    reducer: AuthSlice.reducer,
  });
  useInjectSaga({
    key: AuthSlice.sliceKey,
    saga: AuthSaga,
  });
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    checkLocalStorage('CA', values);
    local.clearLocalStorage();
  };

  const checkLocalStorage = (type: string, values?: any) => {
    if (!_.isEmpty(userInfor)) {
      openNotifi(400, 'please refresh page and logout, so you can login with orther account');
      return;
    }
    local.clearLocalStorage();
    switch (type) {
      case 'FB':
        dispatch(AuthSlice.actions.signUpWithFB({}));
        break;
      case 'GG':
        dispatch(AuthSlice.actions.signUpWithGG({}));
        break;
      case 'CA':
        dispatch(AuthSlice.actions.sigInUser(values));
        break;
    }
  };

  return (
    <div className="form_input form_sign_in">
      <div className="logo">
        <img src={logo} alt={logo} className="logo_img" />
      </div>
      <Form form={form} name="horizontal_login" onFinish={onFinish}>
        <Form.Item name="account" rules={[{ required: true, message: 'please input account.' }]}>
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="input account"
          />
        </Form.Item>
        <Form.Item name="passWord" rules={[{ required: true, message: 'please input password.' }]}>
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="input password"
          />
        </Form.Item>
        <Form.Item shouldUpdate>
          {() => (
            <>
              <Button
                type="primary"
                htmlType="submit"
                disabled={
                  !form.isFieldsTouched(true) ||
                  !!form.getFieldsError().filter(({ errors }) => errors.length).length
                }>
                Sign In
              </Button>
              <Tooltip title="You have code login">
                <CheckCircleTwoTone
                  twoToneColor="#52c41a"
                  onClick={() => setFromAuth(true)}
                  style={{ marginLeft: '10px' }}
                />
              </Tooltip>
            </>
          )}
        </Form.Item>
        <Form.Item>
          <Tooltip title="Forgot Password">
            <Typography.Link href="password">Forgot Password</Typography.Link>
          </Tooltip>
        </Form.Item>
      </Form>
      <Typography.Link href="termsOfService" style={{ marginBottom: '10px' }}>
        Terms of Service ChatApp
      </Typography.Link>
      <Typography.Link href="privacyPolicy" style={{ marginBottom: '10px' }}>
        Privacy Policy ChatApp
      </Typography.Link>
      <div style={{ display: 'flex' }}>
        <button className="loginBtn loginBtn--facebook" onClick={() => checkLocalStorage('FB')}>
          Login with Facebook
        </button>
        <button className="loginBtn loginBtn--google" onClick={() => checkLocalStorage('GG')}>
          Login with Google
        </button>
      </div>
    </div>
  );
}
