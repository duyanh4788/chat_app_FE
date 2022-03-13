/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import * as _ from 'lodash';
import * as AuthSlice from 'store/auth/shared/slice';
import { AuthSaga } from 'store/auth/shared/saga';
import {
  useInjectReducer,
  useInjectSaga,
} from 'store/core/@reduxjs/redux-injectors';
import { Form, Input, Button } from 'antd';
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

  useEffect(() => {
    return () => {
      form.resetFields();
    };
  }, []);

  const onFinish = (values: any) => {
    dispatch(AuthSlice.actions.sigInUser(values));
  };

  return (
    <div className="form_input form_sign_in ">
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <img src={logo} alt={logo} width={50} height={50} />
      </div>
      <Form form={form} name="horizontal_login" onFinish={onFinish}>
        <Form.Item
          name="account"
          rules={[{ required: true, message: 'Vui lòng nhập tài khoản' }]}
        >
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="Nhập tài khoản"
          />
        </Form.Item>
        <Form.Item
          name="passWord"
          rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Nhập mật khẩu"
          />
        </Form.Item>

        <Form.Item shouldUpdate>
          {() => (
            <Button
              type="primary"
              htmlType="submit"
              disabled={
                !form.isFieldsTouched(true) ||
                !!form.getFieldsError().filter(({ errors }) => errors.length)
                  .length
              }
            >
              Đăng nhập
            </Button>
          )}
        </Form.Item>
      </Form>
    </div>
  );
}
