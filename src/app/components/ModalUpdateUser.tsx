/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Modal, Input, Upload, Button, Avatar } from 'antd';
import { UploadOutlined, UserOutlined, MailOutlined, AccountBookOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
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
  handleUpDateInfo: (avatar: string, account: string, _id: string) => void;
}

export function ModalUpdateUser(props: Props) {
  const { isModalOpen, handleOk, handleCancel, handleUploadAWS3Modal, handleUpDateInfo } = props;
  const loading = useSelector(AuthSelector.selectLoading);
  const userInfor = useSelector(AuthSelector.selectUserById);
  const uploadAWS = useSelector(ChatAppSelector.selectUploadAWS);

  const [avatar, setAvatar] = useState<string>('');
  const [account, setAccount] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [fullName, setFullName] = useState<string>('');

  useEffect(() => {
    function initInfoUser(data: any) {
      if (!data) return;
      setAccount(data.account);
      setEmail(data.email);
      setFullName(data.fullName);
      setAvatar(data.avatar);
    }
    setTimeout(() => initInfoUser(userInfor));

    return () => {
      setAccount('');
      setEmail('');
      setFullName('');
      setAvatar('');
    };
  }, [userInfor]);

  return (
    <Modal
      title="INFOR USER"
      open={isModalOpen}
      onOk={() => handleUpDateInfo(uploadAWS, fullName, userInfor._id)}
      onCancel={handleCancel}>
      {loading && <AppLoading loading />}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
        <Avatar
          shape="square"
          size={140}
          src={!_.isEmpty(uploadAWS) ? uploadAWS : avatar}
          style={{ fontSize: '100px', marginBottom: '10px' }}>
          {AppHelper.convertFullName(fullName)}
        </Avatar>
        <Upload
          action=""
          showUploadList={false}
          listType="picture"
          beforeUpload={file => {
            handleUploadAWS3Modal(file);
            return false;
          }}>
          <Button shape="circle" icon={<UploadOutlined />} />
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
    </Modal>
  );
}
