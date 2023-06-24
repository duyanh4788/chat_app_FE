/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Modal, Input, Upload, Button, Avatar, Switch, Radio, Space, Skeleton } from 'antd';
import { UploadOutlined, UserOutlined, MailOutlined, AccountBookOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import * as AuthSlice from 'store/auth/shared/slice';
import * as AuthSelector from 'store/auth/shared/selectors';
import * as ChatAppSelector from 'store/chatApp/shared/selectors';
import * as _ from 'lodash';
import { RcFile } from 'antd/lib/upload';
import { AppLoading } from 'store/utils/Apploading';
import { AppHelper } from 'store/utils/app.helper';

interface Props {
  isModalOpen: boolean;
  handleOk: () => void;
  handleCancel: () => void;
  handleUploadAWS3Modal: (files: RcFile) => void;
  handleQrCode: (isBol: boolean) => void;
  handleUpDateInfo: (
    avatar: string,
    account: string,
    _id: string,
    twoFA: boolean,
    type2FA: number,
  ) => void;
}

export function ModalUpdateUser(props: Props) {
  const {
    isModalOpen,
    handleOk,
    handleCancel,
    handleUploadAWS3Modal,
    handleUpDateInfo,
    handleQrCode,
  } = props;
  const dispatch = useDispatch();
  const loading = useSelector(AuthSelector.selectLoading);
  const userInfor = useSelector(AuthSelector.selectUserById);
  const uploadAWS = useSelector(ChatAppSelector.selectUploadAWS);
  const loadingImage = useSelector(ChatAppSelector.selectLoadingImage);

  const [avatar, setAvatar] = useState<string>('');
  const [account, setAccount] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [fullName, setFullName] = useState<string>('');
  const [twoFA, setTwoFA] = useState<boolean>(false);
  const [type2FA, setType2FA] = useState<number>(1);

  useEffect(() => {
    function initInfoUser(data: any) {
      if (!isModalOpen) return;
      if (!data) return;
      setAccount(data.account);
      setEmail(data.email);
      setFullName(data.fullName);
      setAvatar(data.avatar);
      setTwoFA(data.twofa);
      if (data.type2FA === 'PASSPORT') {
        setType2FA(2);
      }
      if (data.type2FA === 'AUTH_CODE' || data.type2FA === '') {
        setType2FA(1);
      }
      if (uploadAWS.length) {
        setAvatar(uploadAWS[0]);
      }
    }
    setTimeout(() => initInfoUser(userInfor));

    return () => {
      setAccount('');
      setEmail('');
      setFullName('');
      setAvatar('');
      setTwoFA(false);
      setType2FA(1);
    };
  }, [userInfor, uploadAWS, isModalOpen]);

  const handleType2FaApp = e => {
    setType2FA(e.target.value);
    if (e.target.value === 2) {
      handleQrCode(true);
      dispatch(AuthSlice.actions.getAuthPair());
    }
  };

  return (
    <Modal
      title="INFOR USER"
      open={isModalOpen}
      onOk={() => handleUpDateInfo(avatar, fullName, userInfor._id as string, twoFA, type2FA)}
      onCancel={handleCancel}>
      {loading && <AppLoading loading />}
      <div className="modal_avatar">
        {loadingImage ? (
          <Skeleton active style={{ maxWidth: '140px' }} />
        ) : (
          <Avatar
            shape="square"
            size={140}
            src={uploadAWS.length ? uploadAWS[0] : avatar}
            style={{ fontSize: '100px', marginBottom: '10px' }}>
            {AppHelper.convertFullName(fullName)}
          </Avatar>
        )}
        <Upload
          action=""
          showUploadList={false}
          listType="picture"
          beforeUpload={file => {
            handleUploadAWS3Modal(file);
            return false;
          }}>
          <Button shape="circle" icon={<UploadOutlined />} className="modal_upload" />
        </Upload>
      </div>
      <Input
        className="mg-bottom"
        prefix={<UserOutlined className="site-form-item-icon" />}
        value={account}
      />
      <Input
        className="mg-bottom"
        prefix={<MailOutlined className="site-form-item-icon" />}
        value={email}
      />
      <Input
        prefix={<AccountBookOutlined className="site-form-item-icon" />}
        value={fullName}
        onChange={e => setFullName(e.target.value)}
      />
      <Radio.Group style={{ marginTop: '20px' }} onChange={handleType2FaApp} value={type2FA}>
        <Space direction="vertical">
          <Switch
            checkedChildren="TWO 2FA"
            unCheckedChildren="twoFA"
            checked={twoFA}
            onChange={isChecked => setTwoFA(isChecked)}
          />
          {twoFA && (
            <React.Fragment>
              <Radio value={1}>Email</Radio>
              <Radio value={2}>Authenticator</Radio>
            </React.Fragment>
          )}
        </Space>
      </Radio.Group>
    </Modal>
  );
}
