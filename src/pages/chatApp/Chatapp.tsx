/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import io from 'socket.io-client';
import {
  Layout,
  Menu,
  Breadcrumb,
  notification,
  Input,
  Tooltip,
  Form,
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
import ScrollToBottom from 'react-scroll-to-bottom';
import ReactEmoji from 'react-emoji';
import { SOCKET_COMMIT } from 'store/commom/socket_commit';
import { AppHelper } from 'store/utils/app.helper';

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
  const onDate = AppHelper.formDateYDM(new Date());
  console.log(onDate);
  const PORRT: any = ApiRouter.SOCKET_LOCAL;
  const socket = io(PORRT, { transports: ['websocket'] });
  const room = 'FE01';

  useEffect(() => {
    // join room
    socket.emit(SOCKET_COMMIT.JOIN_ROOM, { room, fullName, account, uid });
    // render list member
    socket.on(SOCKET_COMMIT.SEND_LIST_CLIENT, listUser => {});
    // send message
    socket.emit(SOCKET_COMMIT.SEND_MESSAGE, sendMessage, acknowLedGements);
    // reciver message
    socket.on(SOCKET_COMMIT.SEND_MESSAGE, receiverMessage => {
      setReceiverMessage(receiverMessage);
    });
    socket.on(SOCKET_COMMIT.SEND_ARRAY_MESSAGE, arrayMessage => {
      setReceiverArrayMessage(arrayMessage);
    });
    // send location
    socket.emit(SOCKET_COMMIT.SEND_LOCATION, sendLocation);
    // disconecet
    return () => {
      socket.on(SOCKET_COMMIT.DISCONNECT, () => {
        return () => {
          socket.disconnect();
        };
      });
    };
  }, [sendMessage, sendLocation]);

  useEffect(() => {
    socket.on(SOCKET_COMMIT.SEND_MESSAGE_NOTIFY, message => {
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
            <div className="member_chat" key={idx}>
              <Avatar className="bg_green avatar_img">{row.fullName}</Avatar>
              <div className="message_box">
                <p className="message_text">
                  {ReactEmoji.emojify(row.message)}
                </p>
                <p className="time">{row.createAt}</p>
              </div>
            </div>
          );
        }
        return (
          <div className="my_chat" key={idx}>
            <div className="message_box">
              <p className="message_text">{ReactEmoji.emojify(row.message)}</p>
              <span className="time">{row.createAt}</span>
            </div>
            <Avatar className="bg_green avatar_img">{row.fullName}</Avatar>
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
        <Header className="site-layout-background">
          <Breadcrumb className="avatar">
            <Breadcrumb.Item>
              <Avatar className="bg_green" icon={<UserOutlined />} />
              <span className="account">{fullName}</span>
            </Breadcrumb.Item>
          </Breadcrumb>
        </Header>
        <Content className="site-layout">
          <ScrollToBottom className="row_chat">
            {renderMessage()}
          </ScrollToBottom>
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
