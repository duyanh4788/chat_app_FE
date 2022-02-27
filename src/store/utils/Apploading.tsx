import React from 'react';
import { Spin, Alert } from 'antd';
import styled from 'styled-components';

const LoadingWrapper = styled.div`
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 9999999999;
  justify-content: center;
`;

export const LoaderFallBack = () => ({
  fallback: <AppLoading loading={true} />,
});

export function AppLoading({ loading }) {
  return (
    <LoadingWrapper>
      <Spin tip="Loading...">
        <Alert type="info" />
      </Spin>
    </LoadingWrapper>
  );
}
