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
import * as ChatAppSelector from 'store/chatApp/shared/selectors';
import * as AuthSlice from 'store/auth/shared/slice';
import { ChatAppSaga } from 'store/chatApp/shared/saga';
import { useInjectReducer, useInjectSaga } from 'store/core/@reduxjs/redux-injectors';
import { Helmet } from 'react-helmet';
import {
  Layout,
  Menu,
  Breadcrumb,
  Input,
  Tooltip,
  Avatar,
  Button,
  Upload,
  Image,
  Spin,
  Badge,
} from 'antd';
import {
  RollbackOutlined,
  UserOutlined,
  SendOutlined,
  HeatMapOutlined,
  SmileOutlined,
  UploadOutlined,
  CloseCircleTwoTone,
  LoadingOutlined,
} from '@ant-design/icons';
import type { RcFile, UploadProps } from 'antd/es/upload';
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
import { ModalUpdateUser } from 'app/components/ModalUpdateUser';
import { LocalStorageService } from 'store/services/localStorage';
import { TOKEN_EXPRIED } from 'store/commom/common.contants';

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;
const { Dragger } = Upload;

export const Chatapp = () => {
  const userAuthContext = useContext(AuthContext);
  const history = useHistory();
  const dispatch = useDispatch();

  const local = new LocalStorageService();
  const userInfor = local.getItem('_info');

  useInjectReducer({
    key: ChatAppSlice.sliceKey,
    reducer: ChatAppSlice.reducer,
  });
  useInjectSaga({
    key: ChatAppSlice.sliceKey,
    saga: ChatAppSaga,
  });
  const loading = useSelector(ChatAppSelector.selectLoading);
  const loadingPaging = useSelector(ChatAppSelector.selectLoadingPaging);
  const convertStation = useSelector(ChatAppSelector.selectConvertStation);
  const uploadAWS = useSelector(ChatAppSelector.selectUploadAWS);
  const getListMessages = useSelector(ChatAppSelector.selectGetListMessages);
  const getListUsers = useSelector(ChatAppSelector.selectListUsers);
  const [listUsers, setListUsers] = useState<any[]>([]);
  const [collapsed, setCollapsed] = useState(false);
  const [errorAcknow, setErrorAcknow] = useState<any>(undefined);
  const [sendMessage, setSendMessage] = useState<any>(undefined);
  const [listMessages, setListMessages] = useState<any[]>([]);
  const [formDataUploadAWS3, setFromDataUploadAWS3] = useState<any>(undefined);
  const [myFriend, setMyFriend] = useState<any>(null);
  const [notiFyTitle, setNotiFyTitle] = useState<any>('Chat App');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const socket: any = useRef();
  const notiFyTitleRef: any = useRef();
  const PORT_SOCKET: any = ApiRouter.SOCKET_URL;

  useEffect(() => {
    const handleBeforeUnload = e => {
      e.preventDefault();
      e.returnValue = '';
      socket.current.emit(SOCKET_COMMIT.DISCONNECTED, userAuthContext);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    dispatch(ChatAppSlice.actions.getListUsers());
    document.addEventListener('paste', handlePasteImage);

    const storeSub$: Unsubscribe = RootStore.subscribe(() => {
      const { type, payload } = RootStore.getState().lastAction;
      if (!payload) return;
      const { data, message } = payload;
      if (message === TOKEN_EXPRIED) {
        openNotifi(400, message);
        local.clearLocalStorage();
        return history.push('/');
      }
      switch (type) {
        case ChatAppSlice.actions.removeUploadAWS3Success.type:
          setFromDataUploadAWS3(undefined);
          break;
        case AuthSlice.actions.updateInfoSuccess.type:
          dispatch(AuthSlice.actions.getUserById(_.get(userInfor, 'id')));
          setIsModalOpen(false);
          resetFromChat();
          break;
        case AuthSlice.actions.getUserByIdFail.type:
          openNotifi(400, payload);
          local.clearLocalStorage();
          history.push('/');
          break;
        case ChatAppSlice.actions.getListUsersFail.type:
          openNotifi(400, payload);
          break;
        case ChatAppSlice.actions.getListMessagesFail.type:
          openNotifi(400, payload);
          break;
        case ChatAppSlice.actions.postUploadAWS3Fail.type:
          openNotifi(400, payload);
          break;
        case ChatAppSlice.actions.removeUploadAWS3Fail.type:
          setFromDataUploadAWS3(undefined);
          break;
        case AuthSlice.actions.updateInfoFail.type:
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
      document.removeEventListener('paste', handlePasteImage);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    if (!_.isEmpty(convertStation) && !listMessages.length) {
      dispatch(
        ChatAppSlice.actions.getListMessages({
          conversationId: _.get(convertStation, '_id'),
          skip: 0,
        }),
      );
    }
  }, [convertStation]);

  useEffect(() => {
    socket.current = io(PORT_SOCKET, {
      transports: ['websocket'],
      auth: {
        Authorization: _.get(userInfor, 'toKen'),
      },
    });
    socket.current.emit(SOCKET_COMMIT.JOIN_ROOM, userAuthContext);
    socket.current.on(SOCKET_COMMIT.SEND_MESSAGE_NOTIFY, (message: string) => {
      return openNotifi(200, message);
    });
    socket.current.on(SOCKET_COMMIT.SEND_MESSAGE_SENDER, (obJectNotify: any) => {
      notiFyTitleRef.current = obJectNotify;
      if (obJectNotify.reciverId === _.get(userAuthContext, '_id')) {
        return setNotiFyTitle(obJectNotify.message);
      }
    });
    socket.current.on(SOCKET_COMMIT.SEND_LIST_MESSAGE, (dataMessage: any) => {
      return setListMessages(oldMessages => [...oldMessages, dataMessage]);
    });
    socket.current.on(SOCKET_COMMIT.CONNECT_ERROR, (err: Error) => {
      local.clearLocalStorage();
      setNotiFyTitle('AUTHORIZATION_INVALID');
      return history.push('/');
    });
    return () => {
      socket.current.emit(SOCKET_COMMIT.DISCONNECTED, userAuthContext);
      socket.current.disconnect();
    };
  }, [PORT_SOCKET, userAuthContext]);

  useEffect(() => {
    if (!_.isEmpty(getListUsers)) {
      setListUsers(getListUsers);
      socket.current.on(SOCKET_COMMIT.CHANGE_STATUS_ONLINE, (dataUser: any) => {
        let newList: any[] = getListUsers.filter(({ _id }) => _id !== dataUser._id);
        newList.push(dataUser);
        setListUsers(newList);
      });
      socket.current.on(SOCKET_COMMIT.CHANGE_STATUS_OFFLINE, (dataUser: any) => {
        let newList: any[] = getListUsers.filter(({ _id }) => _id !== dataUser._id);
        newList.push(dataUser);
        setListUsers(newList);
      });
    }
  }, [getListUsers]);

  useEffect(() => {
    handleAutoScroll(false);
    function initListMsg(msg: any) {
      if (!msg || (msg && !msg.listMessages?.length)) return;
      if (!listMessages.length) {
        setListMessages(msg.listMessages);
        return;
      }
      if (listMessages.length) {
        msg.listMessages.forEach(item => {
          setListMessages(old => [item, ...old]);
        });
        return;
      }
    }
    initListMsg(getListMessages);
  }, [getListMessages]);

  useEffect(() => {
    if (errorAcknow) {
      openNotifi(400, errorAcknow);
    }
  }, [errorAcknow]);

  const handleAutoScroll = (type: boolean) => {
    let myRow: HTMLElement | any = document.querySelector('.site_layout');
    if (!_.isEmpty(myRow) && listMessages?.length <= 9 && !type) {
      setTimeout(() => {
        myRow.scrollTop = myRow.scrollHeight;
      }, 200);
    }
    if (type) {
      setTimeout(() => {
        myRow.scrollTop = myRow.scrollHeight;
      }, 200);
    }
  };

  const handleSelectUser = (friend: any) => {
    setMyFriend(friend);
    if (
      !convertStation ||
      (convertStation && convertStation?.members?.includes(friend._id) === false)
    ) {
      dispatch(
        ChatAppSlice.actions.saveConvertStation({
          reciverId: _.get(friend, '_id'),
          senderId: _.get(userAuthContext, '_id'),
        }),
      );
    }
  };

  const acknowLedGements = (error: any) => {
    if (error) {
      return setErrorAcknow(error);
    }
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
    if (!_.isEmpty(uploadAWS)) {
      socket.current.emit(
        SOCKET_COMMIT.SEND_MESSAGE,
        userAuthContext,
        { ...getValueFromChat(), text: uploadAWS },
        acknowLedGements,
      );
    }
    handleAutoScroll(true);
    return resetFromChat();
  };

  const shareLocation = () => {
    if (!navigator.geolocation) {
      return 'Browser Not Support Location';
    }
    navigator.geolocation.getCurrentPosition(position => {
      const linkLocation = `https://www.google.com/maps?q=${position.coords.latitude},${position.coords.longitude}`;
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
    setFromDataUploadAWS3(undefined);
    dispatch(ChatAppSlice.actions.clearUploadAWS3());
  };

  const renderCheckTypeMessages = (text: string) => {
    if (!_.isEmpty(text) && !AppHelper.checkLinkHttp(text)) {
      return <p className="message_text">{text}</p>;
    } else if (!AppHelper.checkLinkAWS(text)) {
      return (
        <a href={text} target="_blank" className="message_text">
          {text}
        </a>
      );
    } else {
      return <Image width="100%" src={text} className="message_text" />;
    }
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
                  {renderCheckTypeMessages(row.text)}
                  <span className="time">{format(row.createdAt)}</span>
                </div>
                <Avatar className="bg_green avatar_img" src={_.get(userAuthContext, 'avatar')}>
                  {!_.isEmpty(_.get(userAuthContext, 'fullName'))
                    ? AppHelper.convertFullName(_.get(userAuthContext, 'fullName'))
                    : ''}
                </Avatar>
              </div>
            );
          } else {
            return (
              <div className="member_chat" key={idx}>
                <Avatar
                  className="bg_green avatar_img"
                  src={convertStation.avataReciver !== '' ? convertStation.avataReciver : null}>
                  {!_.isEmpty(myFriend)
                    ? AppHelper.convertFullName(_.get(myFriend, 'fullName'))
                    : ''}
                </Avatar>
                <div className="message_box">
                  {renderCheckTypeMessages(row.text)}
                  <span className="time">{format(row.createdAt)}</span>
                </div>
              </div>
            );
          }
        });
    }
  };

  const handleUploadAWS3 = (file: RcFile) => {
    const fromData = new FormData();
    fromData.append('file', file);
    let reader = new FileReader();
    reader.addEventListener('load', () => {
      setFromDataUploadAWS3(reader.result);
    });
    reader.readAsDataURL(file);
    dispatch(ChatAppSlice.actions.postUploadAWS3(fromData));
  };

  const handlePasteImage = (evt: ClipboardEvent) => {
    const clipboardItems = evt.clipboardData?.items;
    if (!clipboardItems) {
      return;
    }
    const items = Array.from(clipboardItems).filter(item => {
      return /^image\//.test(item.type);
    });
    if (items.length === 0) {
      return;
    }
    const item = items[0];
    const blob: any = item.getAsFile();
    let file = new File([blob as Blob], 'file name', {
      type: 'image/jpeg',
      lastModified: new Date().getTime(),
    });
    const fileInput = document.querySelector<HTMLInputElement>('#file_input');
    if (fileInput) {
      handleUploadAWS3(file as RcFile);
    }
  };

  const handleUpDateInfo = (
    avatar: string,
    fullName: string,
    _id: string,
    twoFA: boolean,
    type2FAValue: number,
  ) => {
    const type2FA = type2FAValue === 1 ? 'AUTH_CODE' : 'PASSPORT';
    const payload = {
      avatar: !_.isEmpty(avatar) ? avatar : '',
      fullName,
      _id,
      twoFA: !!twoFA,
      type2FA: twoFA ? type2FA : '',
    };
    dispatch(AuthSlice.actions.updateInfo(payload));
  };

  const propsDrag: UploadProps = {
    listType: 'picture',
    openFileDialogOnClick: false,
    beforeUpload: file => {
      handleUploadAWS3(file);
      return false;
    },
  };

  const handleScrollListMessages = () => {
    let myRow: HTMLElement | any = document.querySelector('.site_layout');
    if (myRow.scrollTop < 1 && getListMessages.skip) {
      dispatch(
        ChatAppSlice.actions.getListMessages({
          conversationId: _.get(convertStation, '_id'),
          skip: getListMessages && getListMessages.skip ? getListMessages.skip : 10,
        }),
      );
      return;
    }
  };

  return (
    <React.Fragment>
      <Helmet>
        <title ref={notiFyTitleRef}>{notiFyTitle}</title>
      </Helmet>
      <Layout>
        {loading && <AppLoading loading />}
        <Sider collapsible collapsed={collapsed} onCollapse={(e: boolean) => setCollapsed(e)}>
          <div className="sider_btn">
            <Button
              className="btn_back"
              icon={<RollbackOutlined />}
              onClick={() => {
                localStorage.clear();
                history.push('/');
              }}>
              Back
            </Button>
          </div>
          <Menu theme="dark" defaultSelectedKeys={['sub1']} mode="inline">
            <SubMenu key="sub1" icon={<UserOutlined />} title="My Friends">
              {!_.isEmpty(listUsers) && listUsers.length ? (
                listUsers
                  .filter(item => item._id !== _.get(userAuthContext, '_id'))
                  .map((row, idx) => (
                    <Menu.Item key={idx} className="subMenu" onClick={() => handleSelectUser(row)}>
                      <span>
                        <Avatar
                          size={20}
                          className="bg_green"
                          src={row.avatar !== '' ? row.avatar : null}>
                          {AppHelper.convertFullName(row.fullName)}
                        </Avatar>
                        {row.isNewMsg && (
                          <Badge
                            dot
                            style={{
                              backgroundColor: '#52c41a',
                              width: '10px',
                              height: '10px',
                            }}
                            offset={[-8, -5]}
                          />
                        )}
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
            <Breadcrumb className="avatar" style={{ cursor: 'pointer' }}>
              <Breadcrumb.Item onClick={() => setIsModalOpen(true)}>
                <Avatar className="bg_green" src={_.get(userAuthContext, 'avatar')}>
                  {AppHelper.convertFullName(_.get(userAuthContext, 'fullName'))}
                </Avatar>
                <span className="account">{_.get(userAuthContext, 'fullName')}</span>
              </Breadcrumb.Item>
            </Breadcrumb>
          </Header>
          {convertStation && convertStation._id && convertStation.members.length ? (
            <React.Fragment>
              <Content className="site_layout" onScroll={handleScrollListMessages}>
                {loadingPaging && (
                  <div style={{ textAlign: 'center' }}>
                    <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
                  </div>
                )}
                {renderMessage()}
              </Content>
              <div className="form_chat">
                <Dragger {...propsDrag}>
                  <Input
                    id="file_input"
                    placeholder="Enter Message"
                    value={sendMessage}
                    onChange={e => setSendMessage(e.target.value)}
                    onPressEnter={onSendMessage}
                    onFocus={e => {
                      setNotiFyTitle('Chat App');
                      notiFyTitleRef.current = undefined;
                    }}
                    suffix={
                      <React.Fragment>
                        <Upload
                          action=""
                          listType="picture"
                          beforeUpload={file => {
                            handleUploadAWS3(file);
                            return false;
                          }}>
                          <UploadOutlined style={{ cursor: 'pointer', marginRight: '10px' }} />
                        </Upload>
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
                          <HeatMapOutlined type="info-circle" onClick={shareLocation} />
                        </Tooltip>
                      </React.Fragment>
                    }
                  />
                  {formDataUploadAWS3 && !isModalOpen && (
                    <div className="images_review">
                      <Image
                        src={formDataUploadAWS3}
                        width={200}
                        style={{ borderRadius: '10px' }}
                      />
                      <CloseCircleTwoTone
                        style={{ marginLeft: '5px' }}
                        twoToneColor="#00152900"
                        onClick={() => {
                          setSendMessage(undefined);
                          dispatch(
                            ChatAppSlice.actions.removeUploadAWS3({
                              idImage: uploadAWS,
                            }),
                          );
                        }}
                      />
                    </div>
                  )}
                </Dragger>
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
      <ModalUpdateUser
        isModalOpen={isModalOpen}
        handleOk={() => setIsModalOpen(false)}
        handleCancel={() => {
          setIsModalOpen(false);
          if (!_.isEmpty(uploadAWS)) {
            dispatch(
              ChatAppSlice.actions.removeUploadAWS3({
                idImage: uploadAWS,
              }),
            );
          }
        }}
        handleUploadAWS3Modal={handleUploadAWS3}
        handleUpDateInfo={handleUpDateInfo}
      />
    </React.Fragment>
  );
};
