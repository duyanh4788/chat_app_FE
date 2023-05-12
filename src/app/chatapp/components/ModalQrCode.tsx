import React from 'react';
import { Button, Input, Modal, Form } from 'antd';
import QRCode from 'qrcode.react';
import * as AuthSelector from 'store/auth/shared/selectors';
import * as AuthSlice from 'store/auth/shared/slice';
import { useDispatch, useSelector } from 'react-redux';
import { AppLoading } from 'utils/Apploading';

interface Props {
  qrCode: boolean;
  handleOk: () => void;
  handleCancel: () => void;
}

export function ModalQrCode(props: Props) {
  const { qrCode, handleCancel } = props;
  const dispatch = useDispatch();
  const loading = useSelector(AuthSelector.selectLoading);
  const authPair = useSelector(AuthSelector.selectAuthPair);
  const userInfor = useSelector(AuthSelector.selectUserById);

  const handlePairAuth = e => {
    if (e.target.value.length === 6) {
      dispatch(AuthSlice.actions.pairAuth({ token: e.target.value, toKenUser: userInfor.toKen }));
    }
  };

  return (
    <Modal open={qrCode} footer={null} style={{ textAlign: 'center' }} title="Scan the QR code">
      {loading && <AppLoading loading />}
      {authPair ? (
        <React.Fragment>
          <p>
            you hass enable two-factor authentication app, and now you have to scan the QR code and
            setup by App
          </p>
          <div>
            <QRCode value={authPair as string} size={200} fgColor="#000000" />
          </div>

          <Form>
            <Form.Item
              name="TFACode"
              rules={[
                {
                  required: true,
                  message: 'Please input 6-digit code!',
                },
              ]}>
              <Input placeholder="6-digit code" onChange={handlePairAuth} />
            </Form.Item>
            <Form.Item>
              <Button type="link" onClick={handleCancel}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" shape="round">
                Verify
              </Button>
            </Form.Item>
          </Form>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <p>Can not get Code, please try again later</p>
          <Button type="link" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" shape="round">
            Verify
          </Button>
        </React.Fragment>
      )}
    </Modal>
  );
}
