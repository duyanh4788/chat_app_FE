import React from 'react';
import { Button, Input, Modal, Form } from 'antd';
import QRCode from 'qrcode.react';

interface Props {
  qrCode: boolean;
  handleOk: () => void;
  handleCancel: () => void;
}

export function ModalQrCode(props: Props) {
  const { qrCode, handleCancel } = props;
  return (
    <Modal open={qrCode} footer={null} style={{ textAlign: 'center' }} title="Scan the QR code">
      <p>
        you hass enable two-factor authentication app, and now you have to scan the QR code and
        setup by App
      </p>
      <div>
        <QRCode value={'123'} size={200} fgColor="#000000" />
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
          <Input placeholder="6-digit code" />
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
    </Modal>
  );
}
