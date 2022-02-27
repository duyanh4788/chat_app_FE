/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as AuthSelector from 'store/auth/shared/selectors';
import * as AuthSlice from 'store/auth/shared/slice';
import * as AuthConst from 'store/auth/constants/auth.constant';
import { AuthSaga } from 'store/auth/shared/saga';
import {
  useInjectReducer,
  useInjectSaga,
} from 'store/core/@reduxjs/redux-injectors';
import { Form, Input, Button } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import logo from '../../images/logo.png';
import { Unsubscribe } from 'redux';
import { RootStore } from 'store/configStore';
import { openNotificationJoin } from 'store/utils/Notification';

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
    const storeSub$: Unsubscribe = RootStore.subscribe(() => {
      const { type, payload } = RootStore.getState().lastAction;
      switch (type) {
        case AuthSlice.actions.sigInUserSuccess.type:
          openNotificationJoin(200, payload);
          break;
        case AuthSlice.actions.sigInUserFail.type:
          openNotificationJoin(400, payload);
          break;

        default:
          break;
      }
    });
    return () => {
      storeSub$();
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
