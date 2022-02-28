/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import io from 'socket.io-client';
import Axios from 'axios';
import {
  Layout,
  Menu,
  Breadcrumb,
  notification,
  Input,
  Tooltip,
  Form,
  Row,
  Col,
  Avatar,
} from 'antd';
import {
  RollbackOutlined,
  UserOutlined,
  SmileOutlined,
  SendOutlined,
  HeatMapOutlined,
} from '@ant-design/icons';
import { ApiRouter } from 'store/services/request.constants';
import { LocalStorageService } from 'store/services/localStorage';

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

export const Chatapp = () => {
  const local = new LocalStorageService();
  const fullName = local.getItem('_fullName');
  const account = local.getItem('_account');
  const uid = local.getItem('_id');
  const [form] = Form.useForm();
  const [collapsed, setCollapsed] = useState(false);
  // =============================================== //
  const [userList, setUserList] = useState<any[]>([]);
  const [errorAcknow, setErrorAcknow] = useState(null);
  const [sendMessage, setSendMessage] = useState(null);
  const [sendLocation, setSendLocation] = useState<any>('');
  const [receiverMessage, setReceiverMessage] = useState(null);
  const [receiverArrayMessage, setReceiverArrayMessage] = useState<any[]>([]);
  // =============================================== //

  const PORRT: any = ApiRouter.SOCKET_LOCAL;
  const socket = io(PORRT, { transports: ['websocket'] });
  const room = 'FE01';

  useEffect(() => {
    // join room
    socket.emit('join room', { room, fullName, account, uid });
    // render list member
    socket.on('send list client inside room', listUser => {
      console.log(listUser);
    });
    // send message
    socket.emit('send message', sendMessage, acknowLedGements);
    // reciver message
    socket.on('send message', receiverMessage => {
      setReceiverMessage(receiverMessage);
    });
    socket.on('send array message', arrayMessage => {
      setReceiverArrayMessage(arrayMessage);
    });
    // send location
    socket.emit('send location', sendLocation);
    // disconecet
    return () => {
      socket.on('disconnect', () => {
        return () => {
          socket.disconnect();
        };
      });
    };
  }, [sendMessage, sendLocation]);

  useEffect(() => {
    socket.on('send message notify', message => {
      openNotificationJoin(message);
    });
  }, []);

  useEffect(() => {
    if (errorAcknow !== null) {
      openNotificationAcknow();
    }
  });

  useEffect(() => {
    if (receiverMessage && receiverMessage !== null) {
      setErrorAcknow(null);
    }
  });

  const openNotificationJoin = notify => {
    notification.open({
      message: `${notify}`,
      icon: <SmileOutlined style={{ color: '#108ee9' }} />,
    });
  };

  const openNotificationAcknow = () => {
    notification.open({
      message: `${errorAcknow}`,
      icon: <SmileOutlined style={{ color: '#e91010' }} />,
    });
  };

  const acknowLedGements = error => {
    if (error) {
      setErrorAcknow(error);
    }
  };

  const onSendMessage = e => {
    if (e.message !== '') {
      setSendMessage(e.message);
    }
  };

  const shareLocation = () => {
    if (!navigator.geolocation) {
      return 'Browser Not Support Location';
    }
    navigator.geolocation.getCurrentPosition(position => {
      const location = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };
      setSendLocation(location);
    });
  };

  const renderMessage = () => {
    if (receiverArrayMessage) {
      return receiverArrayMessage.map((row, idx) => {
        if (row.account !== account) {
          return (
            <div key={idx} className="member_chat">
              <div className="display_flex">
                <div className="avatar">
                  <Avatar className="bg_green">{row.fullName}</Avatar>
                </div>
                <div className="chat">{row.message}</div>
              </div>
              <p className="time">{row.createAt}</p>
            </div>
          );
        }
        return (
          <div key={idx} className="my_chat">
            <div className="warp_my_chat">
              <div className="display_flex">
                <div className="chat">{row.message}</div>
                <div className="avatar">
                  <Avatar className="bg_green">{row.fullName}</Avatar>
                </div>
              </div>
              <p className="time">{row.createAt}</p>
            </div>
          </div>
        );
      });
    }
  };

  const onCollapse = collapsed => {
    setCollapsed(collapsed);
  };

  return (
    <Layout>
      <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
          <Menu.Item key={userList.length + 1} icon={<RollbackOutlined />}>
            <Link to="/" onClick={() => localStorage.clear()}>
              Come Back
            </Link>
          </Menu.Item>
          <SubMenu key="sub1" icon={<UserOutlined />} title="Member">
            {userList
              .filter(item => item.account === account)
              .map((row, idx) => {
                return <Menu.Item key={idx}>{row.account}</Menu.Item>;
              })}
          </SubMenu>
        </Menu>
      </Sider>
      <Layout>
        <Header className="site-layout-background">Room Chat : {room}</Header>
        <Content className="site-layout">
          <Breadcrumb className="avatar">
            <Breadcrumb.Item>
              <Avatar className="bg_green" icon={<UserOutlined />} />
              <span className="account">{fullName}</span>
            </Breadcrumb.Item>
          </Breadcrumb>
          <Row className="row_chat">
            <Col span={24}>{renderMessage()}</Col>
          </Row>
          <Form
            form={form}
            name="horizontal_login"
            onFinish={onSendMessage}
            className="form_chat"
          >
            <Form.Item name="message">
              <Input
                placeholder="Enter Message"
                suffix={
                  <React.Fragment>
                    <Tooltip title="Send Message">
                      <SendOutlined
                        type="info-circle"
                        style={{
                          color: 'rgba(0,0,0,.45)',
                          marginRight: '10px',
                        }}
                      />
                    </Tooltip>
                    <Tooltip title="Share Location">
                      <HeatMapOutlined
                        type="info-circle"
                        onClick={shareLocation}
                      />
                    </Tooltip>
                  </React.Fragment>
                }
              />
            </Form.Item>
          </Form>
        </Content>
        <Footer>Vũ Duy Anh Design ©2021 Created Chat_App</Footer>
      </Layout>
    </Layout>
  );
};
