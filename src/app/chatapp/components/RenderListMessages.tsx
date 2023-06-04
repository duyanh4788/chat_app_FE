/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable no-useless-concat */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
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
import { AppHelper } from 'store/utils/app.helper';
import { Users } from 'store/model/Users.model';
import { ConvertStations, Messages } from 'store/model/ChatApp.model';
import { format } from 'timeago.js';
import { RcFile } from 'antd/lib/upload';
import { useDispatch, useSelector } from 'react-redux';
import { Socket } from 'socket.io-client';
import { SOCKET_COMMIT } from 'store/commom/socket_commit';
import { openNotifi } from 'store/utils/Notification';
import newmsg from '../../../images/newmsg.png';

const { Content } = Layout;
const { Dragger } = Upload;

interface Props {
  convertStation: ConvertStations;
  userAuthContext: Users;
  myFriend: Users | null;
  listMessages: Messages[];
  notiFyTitleRef: any;
  notiFyTitle: string;
  sendMessage: string | undefined;
  isModalOpen: boolean;
  handleUploadAWS3: (file: RcFile[]) => void;
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
  const [fileUpload, setFileUpload] = useState<any[]>([]);
  const loadingPaging = useSelector(ChatAppSelector.selectLoadingPaging);
  const uploadAWS = useSelector(ChatAppSelector.selectUploadAWS);
  const dispatch = useDispatch();

  useEffect(() => {
    function initUpload(file: any[]) {
      if (!file.length) return;
      if (file.length > 5) {
        setFileUpload([]);
        return openNotifi(400, 'you can upload maximum 5 images');
      }
      if (file.length) {
        handleUploadAWS3(file);
        setFileUpload([]);
      }
    }
    initUpload(fileUpload);
  }, [fileUpload]);

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
    multiple: true,
    beforeUpload: (file, fileList) => {
      setFileUpload(fileList);
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
    if (uploadAWS.length) {
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
      reciverId: _.get(myFriend, '_id'),
      text: '',
    };
  };

  const renderCheckTypeMessages = (text: any) => {
    if (!_.isEmpty(text) && !AppHelper.checkLinkHttp(text)) {
      return <p className="message_text">{text}</p>;
    } else if (!AppHelper.checkLinkAWS(text)) {
      return (
        <a href={text} rel="noopener noreferrer" target="_blank" className="message_text">
          {text}
        </a>
      );
    } else if (text.length) {
      return text.map((item, idx) => {
        if (item.includes('videos')) {
          return (
            <div>
              <video width="200" controls>
                <source src={item} type="video/mp4" />
              </video>
            </div>
          );
        }
        return <Image src={item} key={idx} className="images_text" />;
      });
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
                  multiple={true}
                  beforeUpload={(file, fileList) => {
                    setFileUpload(fileList);
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
          {uploadAWS.length && !isModalOpen
            ? uploadAWS.map((item, idx) => {
                return (
                  <div className="images_review" key={idx}>
                    {item.includes('videos') ? (
                      <video width="200" controls>
                        <source src={item} type="video/mp4" />
                      </video>
                    ) : (
                      <Image src={item} width={200} style={{ borderRadius: '10px' }} />
                    )}
                    <CloseCircleTwoTone
                      style={{ marginLeft: '5px' }}
                      twoToneColor="#00152900"
                      onClick={() => {
                        setSendMessage(undefined);
                        dispatch(
                          ChatAppSlice.actions.removeUploadAWS3({
                            idImage: item,
                          }),
                        );
                        dispatch(ChatAppSlice.actions.clearUploadAWS3(idx));
                      }}
                    />
                  </div>
                );
              })
            : null}
        </Dragger>
      </div>
    </React.Fragment>
  );
}
