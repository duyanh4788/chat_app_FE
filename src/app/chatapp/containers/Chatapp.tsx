/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable no-useless-concat */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState, useContext } from 'react';
import { Socket, io } from 'socket.io-client';
import { useHistory } from 'react-router-dom';
import * as _ from 'lodash';
import * as ChatAppSlice from 'store/chatApp/shared/slice';
import * as ChatAppSelector from 'store/chatApp/shared/selectors';
import * as AuthSlice from 'store/auth/shared/slice';
import { ChatAppSaga } from 'store/chatApp/shared/saga';
import { useInjectReducer, useInjectSaga } from 'store/core/@reduxjs/redux-injectors';
import { Helmet } from 'react-helmet';
import { Layout, Breadcrumb, Avatar } from 'antd';
import { AlignLeftOutlined } from '@ant-design/icons';
import type { RcFile } from 'antd/es/upload';
import { useDispatch, useSelector } from 'react-redux';
import { Unsubscribe } from 'redux';
import { RootStore } from 'store/configStore';
import { ApiRouter } from 'store/services/request.constants';
import { SOCKET_COMMIT } from 'store/commom/socket_commit';
import { AppHelper } from 'store/utils/app.helper';
import { AppLoading } from 'store/utils/Apploading';
import { openNotifi } from 'store/utils/Notification';
import { ModalUpdateUser } from 'app/chatapp/components/ModalUpdateUser';
import { LocalStorageService } from 'store/services/localStorage';
import { isDeveloperment } from 'index';
import { ModalQrCode } from 'app/chatapp/components/ModalQrCode';
import { AuthContext } from 'app/authContext/AuthContextApi';
import { RenderListUsers } from '../components/RenderListUsers';
import { Users } from 'store/model/Users.model';
import { ListMessages, Messages } from 'store/model/ChatApp.model';
import { RenderListMessages } from '../components/RenderListMessages';

const { Header, Content, Footer } = Layout;

export const Chatapp = () => {
  const userAuthContext: Users = useContext(AuthContext);
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
  const convertStation = useSelector(ChatAppSelector.selectConvertStation);
  const uploadAWS = useSelector(ChatAppSelector.selectUploadAWS);
  const getListMessages = useSelector(ChatAppSelector.selectGetListMessages);
  const getListUsers = useSelector(ChatAppSelector.selectListUsers);
  const [listUsers, setListUsers] = useState<Users[]>([]);
  const [drawer, setDrawer] = useState<boolean>(false);
  const [sendMessage, setSendMessage] = useState<string | undefined>(undefined);
  const [listMessages, setListMessages] = useState<Messages[]>([]);
  const [formDataUploadAWS3, setFromDataUploadAWS3] = useState<string | undefined>(undefined);
  const [myFriend, setMyFriend] = useState<Users | null>(null);
  const [notiFyTitle, setNotiFyTitle] = useState<string>('Chat App');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [qrCode, setQrCode] = useState<boolean>(false);
  const socket: Socket | any = useRef<Socket>(null);
  const notiFyTitleRef: any = useRef();
  const PORT_SOCKET: string = ApiRouter.SOCKET_URL as string;
  let myRow: HTMLElement | any = document.querySelector('.site_layout');

  useEffect(() => {
    if (_.isEmpty(userInfor)) {
      history.push('/');
    }

    const handleBeforeUnload = () => {
      socket.current.emit(SOCKET_COMMIT.DISCONNECTED, userAuthContext);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    dispatch(ChatAppSlice.actions.getListUsers());
    document.addEventListener('paste', handlePasteImage);

    const storeSub$: Unsubscribe = RootStore.subscribe(() => {
      const { type, payload } = RootStore.getState().lastAction;
      if (!payload) return;
      const { data, message, code } = payload;
      if (code === 401) {
        openNotifi(400, message);
        local.clearLocalStorage();
        return history.push('/');
      }
      switch (type) {
        case ChatAppSlice.actions.removeUploadAWS3Success.type:
          setFromDataUploadAWS3(undefined);
          break;
        case AuthSlice.actions.updateInfoSuccess.type:
          dispatch(AuthSlice.actions.getUserById({ id: _.get(userInfor, 'id') }));
          setIsModalOpen(false);
          resetFromChat();
          break;
        case AuthSlice.actions.getUserByIdFail.type:
        case ChatAppSlice.actions.getListUsersFail.type:
        case ChatAppSlice.actions.getListMessagesFail.type:
        case ChatAppSlice.actions.postUploadAWS3Fail.type:
        case ChatAppSlice.actions.removeUploadAWS3Fail.type:
        case AuthSlice.actions.updateInfoFail.type:
          openNotifi(400, message);
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
      setMyFriend(null);
      document.removeEventListener('paste', handlePasteImage);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    if (!_.isEmpty(convertStation)) {
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
    // socket.current.on(SOCKET_COMMIT.SEND_MESSAGE_NOTIFY, (message: string) => {
    //   return openNotifi(200, message);
    // });
    socket.current.on(SOCKET_COMMIT.SEND_MESSAGE_SENDER, (obJectNotify: any) => {
      notiFyTitleRef.current = obJectNotify;
      if (obJectNotify.reciverId === _.get(userAuthContext, '_id')) {
        return setNotiFyTitle(obJectNotify.message);
      }
    });
    socket.current.on(SOCKET_COMMIT.SEND_LIST_MESSAGE, (dataMessage: Messages) => {
      return setListMessages(oldMessages => [...oldMessages, dataMessage]);
    });
    if (!isDeveloperment) {
      socket.current.on(SOCKET_COMMIT.CONNECT_ERROR, (err: Error) => {
        local.clearLocalStorage();
        return history.push('/');
      });
    }
    socket.current.on(SOCKET_COMMIT.DISCONNECTED, (data: any) => {
      return history.push('/outTab');
    });
    return () => {
      socket.current.emit(SOCKET_COMMIT.DISCONNECTED, userAuthContext);
      socket.current.disconnect();
    };
  }, [PORT_SOCKET, userAuthContext]);

  useEffect(() => {
    if (!_.isEmpty(getListUsers)) {
      setListUsers(getListUsers);
      socket.current.on(SOCKET_COMMIT.CHANGE_STATUS_ONLINE, (dataUser: Users) => {
        let newList: Users[] = getListUsers.filter(({ _id }) => _id !== dataUser._id);
        newList.push(dataUser);
        setListUsers(newList);
      });
      socket.current.on(SOCKET_COMMIT.CHANGE_STATUS_OFFLINE, (dataUser: Users) => {
        let newList: Users[] = getListUsers.filter(({ _id }) => _id !== dataUser._id);
        newList.push(dataUser);
        setListUsers(newList);
      });
    }
  }, [getListUsers]);

  useEffect(() => {
    handleAutoScroll(false);
    function initListMsg(msg: ListMessages) {
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

  const handleAutoScroll = (type: boolean) => {
    if (!_.isEmpty(myRow) && listMessages?.length <= 9 && !type) {
      setTimeout(() => {
        myRow.scrollTop = myRow?.scrollHeight;
      }, 200);
    }
    if (!_.isEmpty(myRow) && type) {
      setTimeout(() => {
        myRow.scrollTop = myRow?.scrollHeight;
      }, 200);
    }
  };

  const handleSelectUser = (friend: Users) => {
    setListMessages([]);
    setDrawer(false);
    setMyFriend(friend);
    if (
      !convertStation ||
      (convertStation && convertStation?.members?.includes(friend._id as string) === false)
    ) {
      dispatch(
        ChatAppSlice.actions.saveConvertStation({
          reciverId: _.get(friend, '_id'),
          senderId: _.get(userAuthContext, '_id'),
        }),
      );
    }
    handleAutoScroll(true);
  };

  const resetFromChat = () => {
    setSendMessage('');
    setFromDataUploadAWS3(undefined);
    dispatch(ChatAppSlice.actions.clearUploadAWS3());
  };

  const handleUploadAWS3 = (file: RcFile) => {
    const fromData = new FormData();
    fromData.append('file', file);
    let reader = new FileReader();
    reader.addEventListener('load', () => {
      setFromDataUploadAWS3(reader.result as string);
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

  const handleScrollListMessages = () => {
    if (myRow.scrollTop < 1 && getListMessages.skip) {
      dispatch(
        ChatAppSlice.actions.getListMessages({
          conversationId: _.get(convertStation, '_id'),
          skip: getListMessages && getListMessages.skip ? getListMessages.skip : 10,
        }),
      );
      setTimeout(() => {
        myRow.scrollTop = 5;
      }, 200);
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
        <RenderListUsers
          drawer={drawer}
          setDrawer={setDrawer}
          userAuthContext={userAuthContext}
          listUsers={listUsers}
          handleSelectUser={handleSelectUser}
        />
        <Layout>
          <Header className="site_info">
            <div className="icon_drawer">
              <AlignLeftOutlined onClick={() => setDrawer(true)} />
            </div>
            <div className="avatar">
              <Avatar
                className="bg_green"
                src={_.get(userAuthContext, 'avatar')}
                onClick={() => setIsModalOpen(true)}>
                {AppHelper.convertFullName(_.get(userAuthContext, 'fullName'))}
              </Avatar>
              <span className="account">{_.get(userAuthContext, 'fullName')}</span>
            </div>
          </Header>
          {convertStation && convertStation._id && convertStation.members?.length ? (
            <RenderListMessages
              convertStation={convertStation}
              userAuthContext={userAuthContext}
              myFriend={myFriend}
              listMessages={listMessages}
              notiFyTitleRef={notiFyTitleRef}
              notiFyTitle={notiFyTitle}
              sendMessage={sendMessage}
              formDataUploadAWS3={formDataUploadAWS3}
              isModalOpen={isModalOpen}
              handleUploadAWS3={handleUploadAWS3}
              handleScrollListMessages={handleScrollListMessages}
              setSendMessage={setSendMessage}
              setNotiFyTitle={setNotiFyTitle}
              resetFromChat={resetFromChat}
              handleAutoScroll={handleAutoScroll}
              socket={socket}
              myRow={myRow}
            />
          ) : (
            <Content className="site_layout_empty">
              <span>Well Come Chat App</span>
            </Content>
          )}
          <Footer className={convertStation && convertStation._id && 'footer_chatapp'}>
            Vũ Duy Anh Design ©2021 Created Chat_App
          </Footer>
        </Layout>
      </Layout>
      <ModalUpdateUser
        isModalOpen={isModalOpen}
        handleOk={() => {
          setIsModalOpen(false);
          setQrCode(false);
        }}
        handleQrCode={value => setQrCode(value)}
        handleCancel={() => {
          setIsModalOpen(false);
          setQrCode(false);
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
      <ModalQrCode
        qrCode={qrCode}
        handleOk={() => setQrCode(false)}
        handleCancel={() => setQrCode(false)}
      />
    </React.Fragment>
  );
};
