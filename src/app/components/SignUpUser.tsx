/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as AuthSlice from 'store/auth/shared/slice';
import * as AuthSelector from 'store/auth/shared/selectors';
import * as _ from 'lodash';
import { AuthSaga } from 'store/auth/shared/saga';
import {
  useInjectReducer,
  useInjectSaga,
} from 'store/core/@reduxjs/redux-injectors';
import { Form, Input, Button } from 'antd';
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import FacebookLogin from 'react-facebook-login';

export function SignUpUser() {
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
  const success = useSelector(AuthSelector.selectSuccess);

  useEffect(() => {
    return () => {
      form.resetFields();
    };
  }, []);

  useEffect(() => {
    if (success) form.resetFields();
  }, [success]);

  const onFinish = values => {
    dispatch(AuthSlice.actions.signUpUser(values));
  };

  const responseFacebook = response => {
    const payload = {
      email: response.email,
      fullName: response.name,
      account: response.email.split('@')[0] + '_' + response.id,
      passWord: response.accessToken,
    };
    dispatch(AuthSlice.actions.signUpWithFB(payload));
  };

  return (
    <div className="form_input">
      <Form form={form} name="horizontal_login" onFinish={onFinish}>
        <Form.Item
          name="account"
          rules={[{ required: true, message: 'Vui lòng nhập tài khoản!' }]}
        >
          <Input
            prefix={<UserAddOutlined className="site-form-item-icon" />}
            placeholder="Nhập tài khoản"
          />
        </Form.Item>
        <Form.Item
          name="passWord"
          rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Nhập mật khẩu"
          />
        </Form.Item>
        <Form.Item
          name="fullName"
          rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
        >
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="Nhập họ tên"
          />
        </Form.Item>
        <Form.Item
          name="email"
          rules={[{ required: true, message: 'Vui lòng nhập Email!' }]}
        >
          <Input
            prefix={<MailOutlined className="site-form-item-icon" />}
            placeholder="Nhập Email"
          />
        </Form.Item>
        <Form.Item shouldUpdate>
          {() => (
            <Button
              htmlType="submit"
              disabled={
                !form.isFieldsTouched(true) ||
                !!form.getFieldsError().filter(({ errors }) => errors.length)
                  .length
              }
            >
              Đăng Ký
            </Button>
          )}
        </Form.Item>
      </Form>
      <FacebookLogin
        appId="167142142781205"
        fields="name,email,picture"
        cssClass="my-facebook-button-class"
        icon="fa-facebook"
        callback={responseFacebook}
      />
    </div>
  );
}
