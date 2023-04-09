import React from 'react';
import { useHistory } from 'react-router-dom';
import * as _ from 'lodash';
import { Layout, Menu, Avatar, Button, Badge } from 'antd';
import { UserOutlined, SmileOutlined } from '@ant-design/icons';
import { AppHelper } from 'store/utils/app.helper';

const { Sider } = Layout;
const { SubMenu } = Menu;

interface Props {
  collapsed: boolean;
  userAuthContext: any;
  listUsers: any;
  setCollapsed: (e: boolean) => void;
  handleSelectUser: (row: any) => void;
}

export function RenderListUsers(props: Props) {
  const { collapsed, setCollapsed, userAuthContext, listUsers, handleSelectUser } = props;
  const history = useHistory();

  return (
    <Sider collapsible collapsed={collapsed} onCollapse={(e: boolean) => setCollapsed(e)}>
      <div className="sider_btn">
        <Button
          className="btn_back"
          onClick={() => {
            localStorage.clear();
            history.push('/');
          }}>
          Log out
        </Button>
      </div>
      <Menu theme="dark" defaultSelectedKeys={['sub1']} mode="inline">
        <SubMenu key="sub1" icon={<UserOutlined />} title="My Friends">
          {!_.isEmpty(listUsers) && listUsers.length ? (
            listUsers
              .filter(item => item._id !== _.get(userAuthContext, '_id'))
              .map((row, idx) => (
                <Menu.Item key={idx} className="subMenu" onClick={() => handleSelectUser(row)}>
                  <span>
                    <Avatar
                      size={20}
                      className="bg_green"
                      src={row.avatar !== '' ? row.avatar : null}>
                      {AppHelper.convertFullName(row.fullName)}
                    </Avatar>
                    {row.isNewMsg && (
                      <Badge
                        dot
                        style={{
                          backgroundColor: '#52c41a',
                          width: '10px',
                          height: '10px',
                        }}
                        offset={[-8, -5]}
                      />
                    )}
                    <span className="account">{row.fullName}</span>
                  </span>

                  <SmileOutlined
                    className="smile_icon"
                    style={{
                      color: row.isOnline ? '#108ee9' : '#e91010',
                    }}
                  />
                </Menu.Item>
              ))
          ) : (
            <Menu.Item key="sub3">Member empty</Menu.Item>
          )}
        </SubMenu>
      </Menu>
    </Sider>
  );
}
