/* eslint-disable no-useless-concat */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import * as _ from 'lodash';
import * as ChatAppSlice from 'store/chatApp/shared/slice';
import * as ChatAppConst from 'store/chatApp/constants/chatapp.constant';
import * as ChatAppSelector from 'store/chatApp/shared/selectors';
import { ChatAppSaga } from 'store/chatApp/shared/saga';
import { useHistory } from 'react-router-dom';
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
import { format } from 'timeago.js';

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

let socket;

export const Chatapp = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const local = new LocalStorageService();
  const infoUser = local.getItem('_info');
  useInjectReducer({
    key: ChatAppSlice.sliceKey,
    reducer: ChatAppSlice.reducer,
  });
  useInjectSaga({
    key: ChatAppSlice.sliceKey,
    saga: ChatAppSaga,
  });
  const loading = useSelector(ChatAppSelector.selectLoading);
  const convertStationMyFriend = useSelector(
    ChatAppSelector.selectConvertStationMyFriend,
  );
  const [collapsed, setCollapsed] = useState(false);
  const [errorAcknow, setErrorAcknow] = useState<any>(undefined);
  const [sendMessage, setSendMessage] = useState<any>(undefined);
  const [listMessages, setListMessages] = useState<any[]>([]);
  const [userList, setUserList] = useState<any[]>([]);
  const [myFriend, setMyFriend] = useState<any>(null);

  useEffect(() => {
    if (_.isEmpty(infoUser)) {
      openNotifi(400, 'Vui lòng đăng nhập');
      return history.push('/');
    }
    dispatch(ChatAppSlice.actions.getListUsers());
    const storeSub$: Unsubscribe = RootStore.subscribe(() => {
      const { type, payload } = RootStore.getState().lastAction;
      switch (type) {
        case ChatAppSlice.actions.getListUsersSuccess.type:
          if (!_.isEmpty(payload) && payload.data.length) {
            setUserList(payload.data);
          }
          break;
        case ChatAppSlice.actions.getListUsersFail.type:
          openNotifi(400, payload);
          break;
        case ChatAppSlice.actions.getListMessagesSuccess.type:
          setListMessages(payload.data);
          break;
        case ChatAppSlice.actions.getListMessagesFail.type:
          openNotifi(400, payload);
          break;
        default:
          break;
      }
    });
    return () => {
      storeSub$();
      dispatch(ChatAppSlice.actions.clearData());
      setListMessages([]);
      setUserList([]);
      setSendMessage(undefined);
      setErrorAcknow(undefined);
    };
  }, []);

  // useEffect(() => {
  //   const PORT_SOCKET: any = ApiRouter.SOCKET_URL;
  //   const room = 'CHAT_APP';
  //   socket = io(PORT_SOCKET, { transports: ['websocket'] });
  //   // join room
  //   socket.emit(SOCKET_COMMIT.JOIN_ROOM, { room, fullName, account, uid });
  //   socket.on(SOCKET_COMMIT.SEND_MESSAGE_NOTIFY, (message: string) => {
  //     openNotifi(200, message);
  //   });
  //   // render list member
  //   socket.on(SOCKET_COMMIT.SEND_LIST_USERS, (listUser: any[]) => {
  //     console.log(listUser);
  //   });
  //   socket.on(SOCKET_COMMIT.SEND_LIST_MESSAGE, (listMessages: any[]) => {
  //     setListMessages(listMessages);
  //   });
  //   socket.emit(SOCKET_COMMIT.DISCONNECTED, (message: any) => {
  //     openNotifi(200, message);
  //     return () => {
  //       socket.disconnect();
  //     };
  //   });
  // }, []);

  useEffect(() => {
    let myRow: HTMLInputElement | any = document.querySelector('.site_layout');
    if (!_.isEmpty(myRow)) {
      myRow.scrollTop = myRow.scrollHeight;
    }
  }, [listMessages]);

  useEffect(() => {
    if (errorAcknow) {
      openNotifi(400, errorAcknow);
    }
  }, [errorAcknow]);

  const onSendMessage = (event: any) => {
    event.preventDefault();
    const data = {
      senderId: _.get(infoUser, 'id'),
      senderName: _.get(infoUser, 'fullName'),
      reciverId: _.get(myFriend, '_id'),
      reciverName: _.get(myFriend, 'fullName'),
      text: sendMessage,
    };
    dispatch(ChatAppSlice.actions.postNewMessage(data));
    return resetData();
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
      // socket.emit(SOCKET_COMMIT.SEND_LOCATION, location);
    });
  };

  const onCollapse = (collapsed: boolean) => {
    setCollapsed(collapsed);
  };

  const resetData = () => {
    setErrorAcknow(undefined);
    setSendMessage('');
  };

  const acknowLedGements = (error: any) => {
    if (error) {
      setErrorAcknow(error);
    }
  };

  const handleSelectUser = (friend: any) => {
    setMyFriend(friend);
    dispatch(
      ChatAppSlice.actions.saveConvertStation({
        reciverId: _.get(friend, '_id'),
        senderId: _.get(infoUser, 'id'),
      }),
    );
  };

  const renderMessage = () => {
    if (_.isEmpty(convertStationMyFriend) && !convertStationMyFriend.length) {
      return (
        <div className="box_chat_empty">
          <span>Hãy gửi lời chào đến {_.get(myFriend, 'fullName')}</span>
        </div>
      );
    }
    if (!_.isEmpty(convertStationMyFriend) && convertStationMyFriend.length) {
      return convertStationMyFriend.map((row, idx) => {
        if (row.senderId === _.get(infoUser, 'id')) {
          return (
            <div className="my_chat" key={idx}>
              <div className="message_box">
                <p className="message_text">
                  {!_.isEmpty(row.text) ? row.text : ''}
                </p>
                <span className="time">{format(row.createdAt)}</span>
              </div>
              <Avatar className="bg_green avatar_img">
                {!_.isEmpty(row.senderName)
                  ? AppHelper.convertFullName(row.senderName)
                  : ''}
              </Avatar>
            </div>
          );
        }
        return (
          <div className="member_chat" key={idx}>
            <Avatar className="bg_green avatar_img">
              {!_.isEmpty(row.reciverName)
                ? AppHelper.convertFullName(row.reciverName)
                : ''}
            </Avatar>
            <div className="message_box">
              <p className="message_text">
                {!_.isEmpty(row.text) ? row.text : ''}
              </p>
              <span className="time">{format(row.createdAt)}</span>
            </div>
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
          <SubMenu key="sub1" icon={<UserOutlined />} title="My Friends">
            {!_.isEmpty(userList) && userList.length ? (
              userList
                .filter(item => item._id !== _.get(infoUser, 'id'))
                .map((row, idx) => (
                  <Menu.Item
                    key={idx}
                    className="subMenu"
                    onClick={() => handleSelectUser(row)}
                  >
                    <Avatar size={20} className="bg_green">
                      {AppHelper.convertFullName(row.fullName)}
                    </Avatar>
                    <span className="account">{row.fullName}</span>
                  </Menu.Item>
                ))
            ) : (
              <Menu.Item key="sub2">Không có thành viên</Menu.Item>
            )}
          </SubMenu>
        </Menu>
      </Sider>
      <Layout>
        <Header className="site_layout_background">
          <Breadcrumb className="avatar">
            <Breadcrumb.Item>
              <Avatar className="bg_green">
                <Avatar className="bg_green">
                  {AppHelper.convertFullName(_.get(infoUser, 'fullName'))}
                </Avatar>
              </Avatar>
              <span className="account">{_.get(infoUser, 'fullName')}</span>
            </Breadcrumb.Item>
          </Breadcrumb>
        </Header>
        {convertStationMyFriend && convertStationMyFriend.length >= 0 ? (
          <React.Fragment>
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
                        onClick={onSendMessage}
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
            </div>
          </React.Fragment>
        ) : (
          <Content className="site_layout_empty">
            <span>Well Come Chat App</span>
          </Content>
        )}

        <Footer>Vũ Duy Anh Design ©2021 Created Chat_App</Footer>
      </Layout>
    </Layout>
  );
};
