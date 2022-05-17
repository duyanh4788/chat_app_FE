/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable no-useless-concat */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState, useContext } from 'react';
import { io } from 'socket.io-client';
import { useHistory } from 'react-router-dom';
import * as _ from 'lodash';
import * as ChatAppSlice from 'store/chatApp/shared/slice';
import * as ChatAppConst from 'store/chatApp/constants/chatapp.constant';
import * as ChatAppSelector from 'store/chatApp/shared/selectors';
import * as AuthSlice from 'store/auth/shared/slice';
import * as AuthSelector from 'store/auth/shared/selectors';
import { ChatAppSaga } from 'store/chatApp/shared/saga';
import {
  useInjectReducer,
  useInjectSaga,
} from 'store/core/@reduxjs/redux-injectors';
import { Helmet } from 'react-helmet';
import { Layout, Menu, Breadcrumb, Input, Tooltip, Avatar, Button } from 'antd';
import {
  RollbackOutlined,
  UserOutlined,
  SendOutlined,
  HeatMapOutlined,
  SmileOutlined,
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { Unsubscribe } from 'redux';
import { RootStore } from 'store/configStore';
import { ApiRouter } from 'store/services/request.constants';
import { SOCKET_COMMIT } from 'store/commom/socket_commit';
import { AppHelper } from 'store/utils/app.helper';
import { AppLoading } from 'store/utils/Apploading';
import { openNotifi } from 'store/utils/Notification';
import { format } from 'timeago.js';
import { AuthContext } from 'app/components/AuthContextApi';
import { LocalStorageService } from 'store/services/localStorage';
import { ChatAppHttp } from 'store/chatApp/service/chatapp.http';
import { configResponse } from 'store/services/request';

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

export const Chatapp = () => {
  const authHttp = new ChatAppHttp();
  const userAuthContext = useContext(AuthContext);
  const history = useHistory();
  const dispatch = useDispatch();
  const local = new LocalStorageService();
  const infoUserLocal = local.getItem('_info');
  useInjectReducer({
    key: ChatAppSlice.sliceKey,
    reducer: ChatAppSlice.reducer,
  });
  useInjectSaga({
    key: ChatAppSlice.sliceKey,
    saga: ChatAppSaga,
  });
  const loading = useSelector(ChatAppSelector.selectLoading);
  const convertStation = useSelector(ChatAppSelector.selectConvertStation);
  const [listUsers, setListUsers] = useState<any[]>([]);
  const [collapsed, setCollapsed] = useState(false);
  const [errorAcknow, setErrorAcknow] = useState<any>(undefined);
  const [sendMessage, setSendMessage] = useState<any>(undefined);
  const [listMessages, setListMessages] = useState<any[]>([]);
  const [myFriend, setMyFriend] = useState<any>(null);
  const [notiFyTitle, setNotiFyTitle] = useState<any>('Chat App');
  const socket: any = useRef();
  const notiFyTitleRef: any = useRef();
  const PORT_SOCKET: any = ApiRouter.SOCKET_URL;

  useEffect(() => {
    async function initListUser() {
      try {
        const data = await authHttp.getListUsers();
        const result = configResponse(data);
        if (!_.isEmpty(result) && result.length) {
          setListUsers(result);
        }
      } catch (error) {
        if (error instanceof Error) {
          openNotifi(400, error.message);
        }
      }
    }
    initListUser();
    const storeSub$: Unsubscribe = RootStore.subscribe(() => {
      const { type, payload } = RootStore.getState().lastAction;
      switch (type) {
        case ChatAppSlice.actions.getListUsersFail.type:
          openNotifi(400, payload);
          break;
        case ChatAppSlice.actions.getListMessagesSuccess.type:
          setListMessages(payload);
          break;
        case ChatAppSlice.actions.getListMessagesFail.type:
          openNotifi(400, payload);
          break;
        case ChatAppSlice.actions.changeStatusofflineFail.type:
          openNotifi(400, payload);
          break;
        default:
          break;
      }
    });
    return () => {
      storeSub$();
      dispatch(ChatAppSlice.actions.clearData());
      dispatch(AuthSlice.actions.clearData());
      setListMessages([]);
      setListUsers([]);
      setSendMessage(undefined);
      setErrorAcknow(undefined);
      setMyFriend(null);
      dispatch(
        ChatAppSlice.actions.changeStatusoffline({
          id: _.get(userAuthContext, '_id'),
        }),
      );
    };
  }, []);

  useEffect(() => {
    if (!_.isEmpty(convertStation)) {
      dispatch(
        ChatAppSlice.actions.getListMessages({
          conversationId: _.get(convertStation, '_id'),
        }),
      );
    }
  }, [convertStation]);

  useEffect(() => {
    socket.current = io(PORT_SOCKET, {
      transports: ['websocket'],
      upgrade: false,
    });
    socket.current.emit(SOCKET_COMMIT.JOIN_ROOM, userAuthContext);
    socket.current.on(SOCKET_COMMIT.SEND_MESSAGE_NOTIFY, (message: string) => {
      return openNotifi(200, message);
    });
    socket.current.on(SOCKET_COMMIT.SEND_MESSAGE_SENDER, (message: string) => {
      notiFyTitleRef.current = message;
      return setNotiFyTitle(message);
    });
    socket.current.on(SOCKET_COMMIT.SEND_LIST_MESSAGE, (dataMessage: any) => {
      return setListMessages(oldMessages => [...oldMessages, dataMessage]);
    });
    return () => {
      socket.current.emit(SOCKET_COMMIT.DISCONNECTED, userAuthContext);
      socket.current.disconnect();
    };
  }, [PORT_SOCKET, userAuthContext]);

  useEffect(() => {
    if (!_.isEmpty(listUsers)) {
      socket.current.on(SOCKET_COMMIT.CHANGE_STATUS_ONLINE, (dataUser: any) => {
        let newList: any[] = listUsers.filter(
          ({ _id }) => _id !== dataUser._id,
        );
        newList.push(dataUser);
        setListUsers(newList);
      });
      socket.current.on(
        SOCKET_COMMIT.CHANGE_STATUS_OFFLINE,
        (dataUser: any) => {
          let newList: any[] = listUsers.filter(
            ({ _id }) => _id !== dataUser._id,
          );
          newList.push(dataUser);
          setListUsers(newList);
        },
      );
    }
  }, [listUsers]);

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

  const handleSelectUser = (friend: any) => {
    setMyFriend(friend);
    dispatch(
      ChatAppSlice.actions.saveConvertStation({
        reciverId: _.get(friend, '_id'),
        senderId: _.get(userAuthContext, '_id'),
      }),
    );
  };

  const acknowLedGements = (error: any) => {
    if (error) {
      return setErrorAcknow(error);
    }
    dispatch(
      ChatAppSlice.actions.postNewMessage({
        ...getValueFromChat(),
        text: sendMessage,
      }),
    );
  };

  const getValueFromChat = () => {
    return {
      conversationId: _.get(convertStation, '_id'),
      senderId: _.get(userAuthContext, '_id'),
      reciverId: _.get(myFriend, '_id'),
      text: '',
    };
  };

  const onSendMessage = (event: any) => {
    event.preventDefault();
    if (sendMessage) {
      socket.current.emit(
        SOCKET_COMMIT.SEND_MESSAGE,
        userAuthContext,
        { ...getValueFromChat(), text: sendMessage },
        acknowLedGements,
      );
    }
    return resetFromChat();
  };

  const shareLocation = () => {
    if (!navigator.geolocation) {
      return 'Browser Not Support Location';
    }
    navigator.geolocation.getCurrentPosition(position => {
      const linkLocation = `https://www.google.com/maps?q=${position.coords.latitude},${position.coords.longitude}`;
      dispatch(
        ChatAppSlice.actions.postNewMessage({
          ...getValueFromChat(),
          text: linkLocation,
        }),
      );
      socket.current.emit(
        SOCKET_COMMIT.SEND_MESSAGE,
        userAuthContext,
        {
          ...getValueFromChat(),
          text: linkLocation,
        },
        acknowLedGements,
      );
    });
  };

  const resetFromChat = () => {
    setErrorAcknow(undefined);
    setSendMessage('');
  };

  const renderMessage = () => {
    if (!_.isEmpty(convertStation) && listMessages.length === 0) {
      return (
        <div className="box_chat_empty">
          <span>Hãy gửi lời chào đến {_.get(myFriend, 'fullName')}</span>
        </div>
      );
    }
    if (!_.isEmpty(convertStation) && listMessages.length) {
      return listMessages
        .filter(({ conversationId }) => conversationId === convertStation._id)
        .map((row, idx) => {
          if (row.senderId === _.get(userAuthContext, '_id')) {
            return (
              <div className="my_chat" key={idx}>
                <div className="message_box">
                  <p className="message_text">
                    {!_.isEmpty(row.text) &&
                    !AppHelper.checkLinkHttp(row.text) ? (
                      row.text
                    ) : (
                      <a href={row.text} target="_blank">
                        {row.text}
                      </a>
                    )}
                  </p>
                  <span className="time">{format(row.createdAt)}</span>
                </div>
                <Avatar className="bg_green avatar_img">
                  {!_.isEmpty(_.get(userAuthContext, 'fullName'))
                    ? AppHelper.convertFullName(
                        _.get(userAuthContext, 'fullName'),
                      )
                    : ''}
                </Avatar>
              </div>
            );
          } else {
            return (
              <div className="member_chat" key={idx}>
                <Avatar className="bg_green avatar_img">
                  {!_.isEmpty(myFriend)
                    ? AppHelper.convertFullName(_.get(myFriend, 'fullName'))
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
          }
        });
    }
  };

  return (
    <React.Fragment>
      <Helmet>
        <title ref={notiFyTitleRef}>{notiFyTitle}</title>
      </Helmet>
      <Layout>
        {loading && <AppLoading loading />}
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={(e: boolean) => setCollapsed(e)}
        >
          <div className="sider_btn">
            <Button
              className="btn_back"
              icon={<RollbackOutlined />}
              onClick={() => {
                localStorage.clear();
                history.push('/');
              }}
            >
              Back
            </Button>
          </div>
          <Menu theme="dark" defaultSelectedKeys={['sub1']} mode="inline">
            <SubMenu key="sub1" icon={<UserOutlined />} title="My Friends">
              {!_.isEmpty(listUsers) && listUsers.length ? (
                listUsers
                  .filter(item => item._id !== _.get(userAuthContext, '_id'))
                  .map((row, idx) => (
                    <Menu.Item
                      key={idx}
                      className="subMenu"
                      onClick={() => handleSelectUser(row)}
                    >
                      <span>
                        <Avatar size={20} className="bg_green">
                          {AppHelper.convertFullName(row.fullName)}
                        </Avatar>
                        <span className="account">{row.fullName}</span>
                      </span>
                      <SmileOutlined
                        style={{
                          color: row.isOnline ? '#108ee9' : '#e91010',
                        }}
                      />
                    </Menu.Item>
                  ))
              ) : (
                <Menu.Item key="sub3">Không có thành viên</Menu.Item>
              )}
            </SubMenu>
          </Menu>
        </Sider>
        <Layout>
          <Header className="site_info">
            <Breadcrumb className="avatar">
              <Breadcrumb.Item>
                <Avatar className="bg_green">
                  <Avatar className="bg_green">
                    {AppHelper.convertFullName(
                      _.get(userAuthContext, 'fullName'),
                    )}
                  </Avatar>
                </Avatar>
                <span className="account">
                  {_.get(userAuthContext, 'fullName')}
                </span>
              </Breadcrumb.Item>
            </Breadcrumb>
          </Header>
          {convertStation &&
          convertStation._id &&
          convertStation.members.length ? (
            <React.Fragment>
              <Content className="site_layout">{renderMessage()}</Content>
              <div className="form_chat">
                <Input
                  placeholder="Enter Message"
                  value={sendMessage}
                  onChange={e => setSendMessage(e.target.value)}
                  onPressEnter={onSendMessage}
                  onFocus={e => setNotiFyTitle('Chat App')}
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
    </React.Fragment>
  );
};
