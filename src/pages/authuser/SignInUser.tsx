import React from 'react';
import { Form, Input, Button } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { Select } from 'antd';
import { useDispatch } from 'react-redux';

const { Option } = Select;

export function SignInUser() {
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const onFinish = ({ room, userName, email }) => {
    dispatch({ type: 'joinRoomSaga', data: { room, userName, email } });
  };

  return (
    <div className="roomChat">
      <Form form={form} name="horizontal_login" onFinish={onFinish}>
        <Form.Item
          name="room"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Select placeholder="Select Room" style={{ width: '100%' }}>
            <Option value="fe01">FE01</Option>
            <Option value="fe02">FE02</Option>
            <Option value="fe03">FE03</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="email"
          rules={[{ required: true, message: 'Please input your email!' }]}
        >
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="email"
          />
        </Form.Item>
        <Form.Item
          name="userName"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="Username"
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
              Join Room
            </Button>
          )}
        </Form.Item>
      </Form>
    </div>
  );
}
