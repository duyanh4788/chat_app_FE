import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import * as _ from 'lodash';
import { Menu, Avatar, Tooltip, Badge, Drawer, AutoComplete } from 'antd';
import { LogoutOutlined, UserOutlined, SmileOutlined } from '@ant-design/icons';
import { AppHelper } from 'utils/app.helper';
import { SearchIcon } from 'hook/search';
import { useDispatch, useSelector } from 'react-redux';
import * as ChatAppSlice from 'store/chatApp/shared/slice';
import * as ChatAppSelector from 'store/chatApp/shared/selectors';

const { SubMenu } = Menu;

interface Props {
  drawer: boolean;
  userAuthContext: any;
  listUsers: any;
  setDrawer: (e: boolean) => void;
  handleSelectUser: (row: any) => void;
}

export function RenderListUsers(props: Props) {
  const { drawer, setDrawer, userAuthContext, listUsers, handleSelectUser } = props;
  const history = useHistory();
  const dispatch = useDispatch();

  const getListUsers = useSelector(ChatAppSelector.selectListUsers);

  const debouncedSearch = _.debounce((value: string) => {
    dispatch(ChatAppSlice.actions.searchUsers(value));
  }, 500);

  const handleSearch = (value: string) => {
    if (!value || value === '' || value.length > 20) return;
    debouncedSearch(value);
  };

  const onSelect = (value: string) => {
    console.log('onSelect', value);
  };

  const renderUser = () => {
    if (!listUsers.length) return;
    return listUsers
      .filter(item => item._id !== _.get(userAuthContext, '_id'))
      .map((row, idx) => (
        <Menu.Item key={idx} className="subMenu" onClick={() => handleSelectUser(row)}>
          <span>
            <Avatar size={20} className="bg_green" src={row.avatar !== '' ? row.avatar : null}>
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
      ));
  };

  return (
    <Drawer
      placement="left"
      closable={false}
      onClose={() => setDrawer(false)}
      open={drawer}
      getContainer={false}>
      <div className="sider_btn">
        <Tooltip title="logout">
          <LogoutOutlined
            onClick={() => {
              localStorage.clear();
              history.push('/');
            }}
            style={{ color: '#ffffff' }}
          />
        </Tooltip>
      </div>
      <Menu theme="dark" defaultSelectedKeys={['sub1']} mode="inline">
        <SubMenu key="sub1" icon={<UserOutlined />} title="My Friends">
          <AutoComplete
            dropdownMatchSelectWidth={252}
            style={{ width: '100%' }}
            options={renderUser()}
            onSelect={onSelect}
            onSearch={handleSearch}>
            <SearchIcon style={{ width: 200 }} />
          </AutoComplete>
          {/* {!_.isEmpty(listUsers) && listUsers.length ? (
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
          )} */}
        </SubMenu>
      </Menu>
    </Drawer>
  );
}
