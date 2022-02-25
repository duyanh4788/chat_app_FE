import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Tag } from 'antd';
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import './scss/mainRoomChat.css';
import { useDispatch } from 'react-redux';

export const MainRomChat = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [, forceUpdate] = useState({});

  // To disable submit button at the beginning.

  useEffect(() => {
    forceUpdate({});
  }, []);

  const onFinish = values => {
    console.log(values);
    dispatch();
  };

  return (
    <div className="mainRoom">
      <div>
        <h1>Room Chat Lẩu Xanh</h1>
        <div className="roomChat">
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
                  type="danger"
                  htmlType="submit"
                  align="center"
                  disabled={
                    !form.isFieldsTouched(true) ||
                    !!form
                      .getFieldsError()
                      .filter(({ errors }) => errors.length).length
                  }
                >
                  Đăng Ký
                </Button>
              )}
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};
