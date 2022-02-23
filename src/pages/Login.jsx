import React, { useEffect, useState } from "react";
import { Form, Input, Button } from "antd";
import { UserOutlined } from "@ant-design/icons";
import "./scss/mainRoomChat.css";
import { useHistory } from "react-router";
import { Select } from "antd";
import { useDispatch } from "react-redux";

const { Option } = Select;

export function Login() {
  const dispatch = useDispatch();
  const history = useHistory();
  const [form] = Form.useForm();
  const [, forceUpdate] = useState({});
  useEffect(() => {
    forceUpdate({});
  }, []);
  const onFinish = ({ room, userName, email }) => {
    dispatch({ type: "joinRoomSaga", data: { room, userName, email } });
    history.push(`/chatapp?room=${room}&userName=${userName}&email=${email}`);
  };
  return (
    <div className="mainRoom">
      <div>
        <h1>Room Chat Lẩu Xanh</h1>
        <div className="roomChat">
          <Form form={form} name="horizontal_login" onFinish={onFinish}>
            <Form.Item
              name="room"
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
            >
              <Select placeholder="Select Room" style={{ width: "100%" }}>
                <Option value="fe01">FE01</Option>
                <Option value="fe02">FE02</Option>
                <Option value="fe03">FE03</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="email"
              rules={[{ required: true, message: "Please input your email!" }]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="email"
              />
            </Form.Item>
            <Form.Item
              name="userName"
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Username"
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
                  Join Room
                </Button>
              )}
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
}
