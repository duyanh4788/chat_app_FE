/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as AuthSlice from 'store/auth/shared/slice';
import * as AuthSelector from 'store/auth/shared/selectors';
import * as _ from 'lodash';
import { AuthSaga } from 'store/auth/shared/saga';
import { useInjectReducer, useInjectSaga } from 'store/core/@reduxjs/redux-injectors';
import { Form, Input, Button } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, UserAddOutlined } from '@ant-design/icons';
import { openNotifi } from 'store/utils/Notification';
import { LocalStorageService } from 'store/services/localStorage';

export function SignUpUser() {
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
    if (!_.isEmpty(userInfor)) {
      openNotifi(400, 'please refresh page and logout, so you can login with orther account');
      return;
    }
    dispatch(AuthSlice.actions.signUpUser(values));
  };

  return (
    <div className="form_input">
      <Form form={form} name="horizontal_login" onFinish={onFinish}>
        <Form.Item name="account" rules={[{ required: true, message: 'please input account.' }]}>
          <Input
            prefix={<UserAddOutlined className="site-form-item-icon" />}
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
        <Form.Item name="fullName" rules={[{ required: true, message: 'please input your name.' }]}>
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="input your name"
          />
        </Form.Item>
        <Form.Item name="email" rules={[{ required: true, message: 'please input email.' }]}>
          <Input
            prefix={<MailOutlined className="site-form-item-icon" />}
            placeholder="input email"
          />
        </Form.Item>
        <Form.Item shouldUpdate>
          {() => (
            <Button
              htmlType="submit"
              disabled={
                !form.isFieldsTouched(true) ||
                !!form.getFieldsError().filter(({ errors }) => errors.length).length
              }>
              Sign Up
            </Button>
          )}
        </Form.Item>
      </Form>
    </div>
  );
}
