/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as AuthSelector from 'store/auth/shared/selectors';
import * as AuthSlice from 'store/auth/shared/slice';
import * as AuthConst from 'store/auth/constants/auth.constant';
import { AuthSaga } from 'store/auth/shared/saga';
import {
  useInjectReducer,
  useInjectSaga,
} from 'store/core/@reduxjs/redux-injectors';
import { Unsubscribe } from 'redux';
import { Form, Input, Button } from 'antd';
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import { RootStore } from 'store/configStore';
import { openNotificationJoin } from 'store/utils/Notification';

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

  useEffect(() => {
    const storeSub$: Unsubscribe = RootStore.subscribe(() => {
      const { type, payload } = RootStore.getState().lastAction;
      const { status, message } = payload;
      switch (type) {
        case AuthSlice.actions.signUpUserSuccess.type:
          openNotificationJoin(status, message);
          break;
        case AuthSlice.actions.signUpUserFail.type:
          openNotificationJoin(status, message);
          break;

        default:
          break;
      }
    });
    return () => {
      storeSub$();
    };
  }, []);

  const onFinish = values => {
    dispatch(AuthSlice.actions.signUpUser(values));
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
    </div>
  );
}