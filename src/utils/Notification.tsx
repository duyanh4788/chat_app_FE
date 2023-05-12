import React from 'react';
import { notification } from 'antd';
import { SmileOutlined } from '@ant-design/icons';

export const openNotifi = (status: number, message: string) => {
  notification.open({
    duration: 5,
    message,
    icon: <SmileOutlined style={{ color: status <= 304 ? '#108ee9' : '#e91010' }} />,
  });
};
