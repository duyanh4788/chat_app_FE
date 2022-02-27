import React from 'react';
import { notification } from 'antd';
import { SmileOutlined } from '@ant-design/icons';

export const openNotificationJoin = (status: number, message: string) => {
  notification.open({
    duration: 100,
    message,
    icon: (
      <SmileOutlined
        style={{ color: status === 200 ? '#108ee9' : '#e91010' }}
      />
    ),
  });
};
