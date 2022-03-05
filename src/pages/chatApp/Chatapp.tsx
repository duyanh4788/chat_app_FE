/* eslint-disable no-useless-concat */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import * as _ from 'lodash';
import * as ListSlice from 'store/list/shared/slice';
import * as ListConst from 'store/list/constants/list.constant';
import * as ListSelector from 'store/list/shared/selectors';
import { ListSaga } from 'store/list/shared/saga';
import {
  useInjectReducer,
  useInjectSaga,
} from 'store/core/@reduxjs/redux-injectors';
import { Link } from 'react-router-dom';
import { Layout, Menu, Breadcrumb, Input, Tooltip, Avatar } from 'antd';
import {
  RollbackOutlined,
  UserOutlined,
  SendOutlined,
  HeatMapOutlined,
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { Unsubscribe } from 'redux';
import { RootStore } from 'store/configStore';
import { ApiRouter } from 'store/services/request.constants';
import { LocalStorageService } from 'store/services/localStorage';
import { SOCKET_COMMIT } from 'store/commom/socket_commit';
import { AppHelper } from 'store/utils/app.helper';
import { AppLoading } from 'store/utils/Apploading';
import { openNotifi } from 'store/utils/Notification';

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

let socket;

export const Chatapp = () => {
  const dispatch = useDispatch();
  const local = new LocalStorageService();
  const fullName = local.getItem('_fullName');
  const account = local.getItem('_account');
  const uid = local.getItem('_id');
  useInjectReducer({
    key: ListSlice.sliceKey,
    reducer: ListSlice.reducer,
  });
  useInjectSaga({
    key: ListSlice.sliceKey,
    saga: ListSaga,
  });
  const loading = useSelector(ListSelector.selectLoading);
  const [collapsed, setCollapsed] = useState(false);
  const [errorAcknow, setErrorAcknow] = useState<any>(undefined);
  const [sendMessage, setSendMessage] = useState<any>(undefined);
  const [receiverArrayMessage, setReceiverArrayMessage] = useState<any[]>([]);
  const [userList, setUserList] = useState<any[]>([]);
  const PORT_SOCKET: any = ApiRouter.SOCKET_LOCAL;

  useEffect(() => {
    dispatch(ListSlice.actions.getListUsers());
    dispatch(ListSlice.actions.getListMessages());
    const storeSub$: Unsubscribe = RootStore.subscribe(() => {
      const { type, payload } = RootStore.getState().lastAction;
      switch (type) {
        case ListSlice.actions.getListUsersSuccess.type:
          if (!_.isEmpty(payload) && payload.data.length) {
            setUserList(payload.data);
          }
          break;
        case ListSlice.actions.getListUsersFail.type:
          openNotifi(400, payload);
          break;
        case ListSlice.actions.getListMessagesSuccess.type:
          setReceiverArrayMessage(payload.data);
          break;
        case ListSlice.actions.getListMessagesFail.type:
          openNotifi(400, payload);
          break;
        default:
          break;
      }
    });
    return () => {
      storeSub$();
      dispatch(ListSlice.actions.clearListMessage());
      dispatch(ListSlice.actions.clearListUser());
      setReceiverArrayMessage([]);
      setUserList([]);
      setSendMessage(undefined);
      setErrorAcknow(undefined);
    };
  }, []);

  useEffect(() => {
    socket = io(PORT_SOCKET, { transports: ['websocket'] });
    const room = 'CHAT_APP';
    // join room
    socket.emit(SOCKET_COMMIT.JOIN_ROOM, { room, fullName, account, uid });
    socket.on(SOCKET_COMMIT.SEND_MESSAGE_NOTIFY, message => {
      openNotifi(200, message);
    });
    socket.on(SOCKET_COMMIT.DISCONNECT, () => {
      return () => {
        socket.disconnect();
      };
    });
  }, [PORT_SOCKET]);

  useEffect(() => {
    // render list member
    // socket.on(SOCKET_COMMIT.SEND_LIST_CLIENT, listUser => {});
    // reciver message
    // socket.on(SOCKET_COMMIT.SEND_MESSAGE, receiverMessage => {});
    socket.on(SOCKET_COMMIT.SEND_ARRAY_MESSAGE, arrayMessage => {
      setReceiverArrayMessage(arrayMessage);
    });
  }, []);

  useEffect(() => {
    let myRow: HTMLInputElement | any = document.querySelector('.site_layout');
    if (!_.isEmpty(myRow)) {
      myRow.scrollTop = myRow.scrollHeight;
    }
  }, [receiverArrayMessage]);

  useEffect(() => {
    if (errorAcknow) {
      openNotifi(400, errorAcknow);
    }
  }, [errorAcknow]);

  const onSendMessage = event => {
    event.preventDefault();
    if (sendMessage) {
      socket.emit(SOCKET_COMMIT.SEND_MESSAGE, sendMessage, acknowLedGements);
    }
    return resetData();
  };

  const resetData = () => {
    setErrorAcknow(undefined);
    setSendMessage('');
  };

  const acknowLedGements = error => {
    if (error) {
      setErrorAcknow(error);
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
      // setSendLocation(location);
      socket.emit(SOCKET_COMMIT.SEND_LOCATION, location);
    });
  };

  const onCollapse = collapsed => {
    setCollapsed(collapsed);
  };
  const renderMessage = () => {
    if (_.isEmpty(receiverArrayMessage) && !receiverArrayMessage.length) {
      return null;
    }
    if (!_.isEmpty(receiverArrayMessage) && receiverArrayMessage.length) {
      return receiverArrayMessage.map((row, idx) => {
        if (!_.isEmpty(row.account) && row.account !== account) {
          return (
            <div className="member_chat" key={idx}>
              <Avatar className="bg_green avatar_img">
                {!_.isEmpty(row.fullName)
                  ? AppHelper.convertFullName(row.fullName)
                  : ''}
              </Avatar>
              <div className="message_box">
                <p className="message_text">
                  {!_.isEmpty(row.message) ? row.message : ''}
                </p>
                <span className="time">
                  {AppHelper.formmatDateTimeChat(row.createAt)}
                </span>
              </div>
            </div>
          );
        }
        return (
          <div className="my_chat" key={idx}>
            <div className="message_box">
              <p className="message_text">
                {!_.isEmpty(row.message) ? row.message : ''}
              </p>
              <span className="time">
                {AppHelper.formmatDateTimeChat(row.createAt)}
              </span>
            </div>
            <Avatar className="bg_green avatar_img">
              {!_.isEmpty(row.fullName)
                ? AppHelper.convertFullName(row.fullName)
                : ''}
            </Avatar>
          </div>
        );
      });
    }
  };

  return (
    <Layout className="layout">
      {loading && <AppLoading loading />}
      <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
          <Menu.Item key={userList.length} icon={<RollbackOutlined />}>
            <Link to="/" onClick={() => localStorage.clear()}>
              Come Back
            </Link>
          </Menu.Item>
          <SubMenu key="sub1" icon={<UserOutlined />} title="Member">
            {!_.isEmpty(userList) && userList.length ? (
              userList.map((row, idx) => {
                return <Menu.Item key={idx}>{row.account}</Menu.Item>;
              })
            ) : (
              <Menu.Item>Không có thành viên</Menu.Item>
            )}
          </SubMenu>
        </Menu>
      </Sider>
      <Layout>
        <Header className="site_layout_background">
          <Breadcrumb className="avatar">
            <Breadcrumb.Item>
              <Avatar className="bg_green" icon={<UserOutlined />} />
              <span className="account">{fullName}</span>
            </Breadcrumb.Item>
          </Breadcrumb>
        </Header>
        <Content className="site_layout">{renderMessage()}</Content>
        <div className="form_chat">
          <Input
            placeholder="Enter Message"
            value={sendMessage}
            onChange={e => setSendMessage(e.target.value)}
            onPressEnter={onSendMessage}
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
                  <HeatMapOutlined type="info-circle" onClick={shareLocation} />
                </Tooltip>
              </React.Fragment>
            }
          />
        </div>
        <Footer>Vũ Duy Anh Design ©2021 Created Chat_App</Footer>
      </Layout>
    </Layout>
  );
};
