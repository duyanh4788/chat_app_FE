/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import * as AuthSlice from 'store/auth/shared/slice';
import { AuthSaga } from 'store/auth/shared/saga';
import { useHistory } from 'react-router-dom';
import { useInjectReducer, useInjectSaga } from 'store/core/@reduxjs/redux-injectors';
import { Form, Input, Button, Tooltip, Typography } from 'antd';
import { MailOutlined, RollbackOutlined, CodeOutlined, LockOutlined } from '@ant-design/icons';
import logo from '../../../images/logo.png';
import { RootStore } from 'store/configStore';
import { Unsubscribe } from 'redux';
import { openNotifi } from 'store/utils/Notification';

enum TypeFromPassWord {
  AUTHCODE = 'AUTHCODE',
  PASSWORD = 'PASSWORD',
}

export const PassWord = () => {
  useInjectReducer({
    key: AuthSlice.sliceKey,
    reducer: AuthSlice.reducer,
  });
  useInjectSaga({
    key: AuthSlice.sliceKey,
    saga: AuthSaga,
  });
  const dispatch = useDispatch();
  const history = useHistory();
  const [form] = Form.useForm();
  const [fromPanel, setFromPanel] = useState<string>(TypeFromPassWord.PASSWORD);
  const [showFromPassWord, setShowFromPassWord] = useState<boolean>(false);
  const [email, setEmail] = useState<string | null>(null);

  const onFinish = (values: any) => {
    if (fromPanel === TypeFromPassWord.PASSWORD) {
      dispatch(AuthSlice.actions.forgotPassword(values));
    }
    if (fromPanel === TypeFromPassWord.AUTHCODE) {
      if (!showFromPassWord) {
        dispatch(AuthSlice.actions.resendOrderForgotPassword(values));
      }
      if (showFromPassWord && email) {
        dispatch(AuthSlice.actions.resetPassword({ ...values, email }));
      }
    }
  };

  useEffect(() => {
    const storeSub$: Unsubscribe = RootStore.subscribe(() => {
      const { type, payload } = RootStore.getState().lastAction;
      const { code, message } = payload;
      if (code === 401) {
        openNotifi(400, message);
        return history.push('/');
      }
      switch (type) {
        case AuthSlice.actions.forgotPasswordSuccess.type:
          openNotifi(200, message);
          setFromPanel(TypeFromPassWord.AUTHCODE);
          setShowFromPassWord(true);
          break;
        case AuthSlice.actions.resendOrderForgotPasswordSuccess.type:
          openNotifi(200, message);
          setFromPanel(TypeFromPassWord.AUTHCODE);
          setShowFromPassWord(true);
          break;
        case AuthSlice.actions.resetPasswordSuccess.type:
          openNotifi(200, message);
          history.push('/');
          break;
        case AuthSlice.actions.forgotPasswordFail.type:
        case AuthSlice.actions.resendOrderForgotPasswordFail.type:
        case AuthSlice.actions.resetPasswordFail.type:
          openNotifi(400, message);
          break;
        default:
          break;
      }
    });
    return () => {
      storeSub$();
      setFromPanel(TypeFromPassWord.PASSWORD);
      setShowFromPassWord(false);
      setEmail(null);
    };
  }, []);

  return (
    <div className="main_form">
      <div
        className={
          showFromPassWord
            ? 'form_input form_password'
            : fromPanel === TypeFromPassWord.PASSWORD
            ? 'form_input form_password_2'
            : 'form_input form_sign_in'
        }>
        <h1>Reset password</h1>
        <div className="logo">
          <img src={logo} alt={logo} className="logo_img" />
        </div>
        <Form form={form} name="horizontal_login" onFinish={onFinish}>
          {fromPanel === TypeFromPassWord.PASSWORD ? (
            <Form.Item name="email" rules={[{ required: true, message: 'please input email.' }]}>
              <Input
                prefix={<MailOutlined className="site-form-item-icon" />}
                placeholder="input email."
                onChange={e => setEmail(e.target.value)}
              />
            </Form.Item>
          ) : (
            <Form.Item name="authCode" rules={[{ required: true, message: 'please input code.' }]}>
              <Input
                prefix={<CodeOutlined className="site-form-item-icon" />}
                placeholder={'input code.'}
              />
            </Form.Item>
          )}

          {showFromPassWord && (
            <React.Fragment>
              <Form.Item
                name="newPassWord"
                rules={[{ required: true, message: 'please input password.' }]}>
                <Input
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  placeholder="please input password."
                />
              </Form.Item>
              <Form.Item
                name="re_newPassWord"
                rules={[
                  { required: true, message: 'please input confirm password.' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('newPassWord') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error('The two passwords that you entered do not match!'),
                      );
                    },
                  }),
                ]}>
                <Input
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  placeholder="please input confirm password."
                />
              </Form.Item>
            </React.Fragment>
          )}

          <Form.Item shouldUpdate>
            {() => (
              <Button
                type="primary"
                htmlType="submit"
                disabled={
                  !form.isFieldsTouched(true) ||
                  !!form.getFieldsError().filter(({ errors }) => errors.length).length
                }>
                {fromPanel === TypeFromPassWord.PASSWORD ? 'Order' : 'Confirm'}
              </Button>
            )}
          </Form.Item>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Tooltip title="home">
              {fromPanel === TypeFromPassWord.PASSWORD ? (
                <Typography.Link href="/">
                  <RollbackOutlined />
                </Typography.Link>
              ) : (
                <RollbackOutlined
                  onClick={() => {
                    setFromPanel(TypeFromPassWord.PASSWORD);
                    setShowFromPassWord(false);
                  }}
                />
              )}
            </Tooltip>
            <span style={{ display: 'flex', flexDirection: 'column' }}>
              <Typography.Text
                type="success"
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  if (!form.getFieldValue('email')) {
                    openNotifi(400, 'please input you email.');
                    return;
                  }
                  setFromPanel(TypeFromPassWord.AUTHCODE);
                  setShowFromPassWord(true);
                }}>
                you have code
              </Typography.Text>
              <Typography.Text
                type="warning"
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  if (form.getFieldValue('email')) {
                    dispatch(
                      AuthSlice.actions.resendOrderForgotPassword({
                        email: form.getFieldValue('email'),
                      }),
                    );
                  }
                }}>
                Didn't recevie a code?
              </Typography.Text>
            </span>
          </div>
        </Form>
      </div>
    </div>
  );
};
