import React, { useEffect, useState } from 'react';
import * as ChatAppSlice from 'store/chatApp/shared/slice';
import * as ChatAppSelector from 'store/chatApp/shared/selectors';
import * as _ from 'lodash';
import { Layout, Input, Tooltip, Upload, Image, Spin, Avatar, UploadProps } from 'antd';
import {
  SendOutlined,
  HeatMapOutlined,
  UploadOutlined,
  CloseCircleTwoTone,
  LoadingOutlined,
} from '@ant-design/icons';
import { AppHelper } from 'utils/app.helper';
import { Users } from 'store/model/Users.model';
import { ConvertStations, Messages } from 'store/model/ChatApp.model';
import { format } from 'timeago.js';
import { RcFile } from 'antd/lib/upload';
import { useDispatch, useSelector } from 'react-redux';
import { Socket } from 'socket.io-client';
import { SOCKET_COMMIT } from 'store/commom/socket_commit';
import { openNotifi } from 'utils/Notification';
import newmsg from '../../../images/newmsg.png';
import { Friends } from 'store/model/Friends.model';

const { Content } = Layout;
const { Dragger } = Upload;

interface Props {
  convertStation: ConvertStations;
  userAuthContext: Users;
  myFriend: Friends | null;
  listMessages: Messages[];
  notiFyTitleRef: any;
  notiFyTitle: string;
  sendMessage: string | undefined;
  formDataUploadAWS3: string | undefined;
  isModalOpen: boolean;
  handleUploadAWS3: (file: RcFile) => void;
  handleScrollListMessages: () => void;
  setSendMessage: (msg: string | undefined) => void;
  setNotiFyTitle: (title: string) => void;
  resetFromChat: () => void;
  handleAutoScroll: (type: boolean) => void;
  socket: Socket | any;
  myRow: HTMLElement | any;
}

export function RenderListMessages(props: Props) {
  const {
    convertStation,
    myFriend,
    userAuthContext,
    listMessages,
    notiFyTitleRef,
    notiFyTitle,
    sendMessage,
    formDataUploadAWS3,
    isModalOpen,
    handleUploadAWS3,
    handleScrollListMessages,
    setSendMessage,
    setNotiFyTitle,
    resetFromChat,
    handleAutoScroll,
    socket,
    myRow,
  } = props;
  const [errorAcknow, setErrorAcknow] = useState<string | undefined>(undefined);
  const loadingPaging = useSelector(ChatAppSelector.selectLoadingPaging);
  const uploadAWS = useSelector(ChatAppSelector.selectUploadAWS);
  const dispatch = useDispatch();

  useEffect(() => {
    if (errorAcknow) {
      openNotifi(400, errorAcknow);
    }
    return () => {
      setErrorAcknow(undefined);
    };
  }, [errorAcknow]);

  const propsDrag: UploadProps = {
    listType: 'picture',
    openFileDialogOnClick: false,
    beforeUpload: file => {
      handleUploadAWS3(file);
      return false;
    },
  };

  const onSendMessage = (event: React.FormEvent) => {
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
    handleAutoScroll(true);
  };

  const acknowLedGements = (error: string) => {
    if (error) {
      return setErrorAcknow(error);
    }
  };

  const getValueFromChat = () => {
    return {
      conversationId: _.get(convertStation, '_id'),
      senderId: _.get(userAuthContext, '_id'),
      reciverId: _.get(myFriend, 'userId'),
      text: '',
    };
  };

  const renderCheckTypeMessages = (text: string) => {
    if (!_.isEmpty(text) && !AppHelper.checkLinkHttp(text)) {
      return <p className="message_text">{text}</p>;
    } else if (!AppHelper.checkLinkAWS(text)) {
      return (
        <a href={text} rel="noopener noreferrer" target="_blank" className="message_text">
          {text}
        </a>
      );
    } else {
      return <Image src={text} className="images_text" />;
    }
  };

  const renderMessage = () => {
    if (!_.isEmpty(convertStation) && listMessages.length === 0) {
      return (
        <div className="box_chat_empty">
          <span>Say hello to {_.get(myFriend, 'fullName')}</span>
        </div>
      );
    }
    if (!_.isEmpty(convertStation) && listMessages.length) {
      return listMessages
        .filter(({ conversationId }) => conversationId === convertStation?._id)
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
                  src={convertStation?.avataReciver !== '' ? convertStation?.avataReciver : null}>
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

  return (
    <React.Fragment>
      <Content className="site_layout" onScroll={handleScrollListMessages}>
        {loadingPaging && (
          <div style={{ textAlign: 'center' }}>
            <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
          </div>
        )}
        {renderMessage()}
      </Content>
      {notiFyTitle !== 'Chat App' && myRow?.scrollTop > 0 && (
        <img
          src={newmsg}
          alt="new messages"
          className="new_chat new_chat_animation"
          onClick={() => {
            console.log(123);
            handleAutoScroll(true);
            setNotiFyTitle('Chat App');
          }}
        />
      )}
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
                <Tooltip title="Share Location">
                  <HeatMapOutlined type="info-circle" onClick={shareLocation} />
                </Tooltip>
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
              </React.Fragment>
            }
          />
          {formDataUploadAWS3 && !isModalOpen && (
            <div className="images_review">
              <Image src={formDataUploadAWS3} width={200} style={{ borderRadius: '10px' }} />
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
  );
}
