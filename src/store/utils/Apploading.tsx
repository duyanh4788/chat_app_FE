import React from 'react';
import { Spin } from 'antd';
import { GithubFilled } from '@ant-design/icons';
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
      <Spin
        indicator={
          <GithubFilled style={{ fontSize: 50, color: '#222260' }} spin />
        }
      />
    </LoadingWrapper>
  );
}
