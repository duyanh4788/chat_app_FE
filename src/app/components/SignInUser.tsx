/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import * as _ from 'lodash';
import * as AuthSlice from 'store/auth/shared/slice';
import { AuthSaga } from 'store/auth/shared/saga';
import { useInjectReducer, useInjectSaga } from 'store/core/@reduxjs/redux-injectors';
import { Form, Input, Button, Tooltip, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import logo from '../../images/logo.png';

export function SignInUser() {
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
    dispatch(AuthSlice.actions.sigInUser(values));
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
            <Button
              type="primary"
              htmlType="submit"
              disabled={
                !form.isFieldsTouched(true) ||
                !!form.getFieldsError().filter(({ errors }) => errors.length).length
              }>
              Sign In
            </Button>
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
        <button
          className="loginBtn loginBtn--facebook"
          onClick={() => dispatch(AuthSlice.actions.signUpWithFB({}))}>
          Login with Facebook
        </button>
        <button
          className="loginBtn loginBtn--google"
          onClick={() => dispatch(AuthSlice.actions.signUpWithGG({}))}>
          Login with Google
        </button>
      </div>
    </div>
  );
}
