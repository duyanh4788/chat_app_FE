import React, { useEffect, useState } from 'react';
import { Modal, Input, Upload, Button, Image } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import * as AuthSelector from 'store/auth/shared/selectors';
import * as ChatAppSelector from 'store/chatApp/shared/selectors';
import * as _ from 'lodash';
import { RcFile } from 'antd/lib/upload';
import { AppLoading } from 'store/utils/Apploading';

interface Props {
  isModalOpen: boolean;
  handleOk: () => void;
  handleCancel: () => void;
  handleUploadAWS3Modal: (files: RcFile) => void;
  handleUpDateInfo: (avatar: string, account: string, _id: string) => void;
}

export function ModalUpdateUser(props: Props) {
  const {
    isModalOpen,
    handleOk,
    handleCancel,
    handleUploadAWS3Modal,
    handleUpDateInfo,
  } = props;
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
      title="Info User"
      visible={isModalOpen}
      onOk={() => handleUpDateInfo(uploadAWS, fullName, userInfor._id)}
      onCancel={handleCancel}
    >
      {loading && <AppLoading loading />}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Image
          src={!_.isEmpty(uploadAWS) ? uploadAWS : avatar}
          width={200}
          style={{ borderRadius: '10px' }}
        />
        <Upload
          action=""
          showUploadList={false}
          listType="picture"
          beforeUpload={file => {
            handleUploadAWS3Modal(file);
            return false;
          }}
        >
          <div style={{ marginLeft: 8 }}>
            <Button icon={<UploadOutlined />}>Upload Avatar</Button>
          </div>
        </Upload>
      </div>
      <div style={{ marginBottom: 24 }}>
        <label>Account:</label>
        <Input value={account} />
      </div>
      <div style={{ marginBottom: 24 }}>
        <label>Email:</label>
        <Input value={email} />
      </div>
      <div>
        <label>FullName:</label>
        <Input value={fullName} onChange={e => setFullName(e.target.value)} />
      </div>
    </Modal>
  );
}
