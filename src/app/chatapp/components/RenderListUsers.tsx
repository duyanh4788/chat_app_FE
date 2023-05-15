import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import * as _ from 'lodash';
import * as ChatAppSlice from 'store/chatApp/shared/slice';
import * as FriendsSlice from 'store/friends/shared/slice';
import * as ChatAppSelector from 'store/chatApp/shared/selectors';
import * as FriendsSelector from 'store/friends/shared/selectors';
import { Menu, Avatar, Tooltip, Badge, Drawer, AutoComplete, Input } from 'antd';
import {
  LogoutOutlined,
  UserOutlined,
  SmileOutlined,
  SearchOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import { AppHelper } from 'utils/app.helper';
import { Friends } from 'store/model/Friends.model';

const { SubMenu } = Menu;

interface Props {
  drawer: boolean;
  userAuthContext: any;
  listFriends: Friends[];
  setDrawer: (e: boolean) => void;
  handleSelectUser: (row: any) => void;
}

export function RenderListUsers(props: Props) {
  const { drawer, setDrawer, userAuthContext, listFriends, handleSelectUser } = props;
  const history = useHistory();
  const dispatch = useDispatch();
  const [showDropdown, setShowDropdown] = useState(false);
  const getListUsers = useSelector(ChatAppSelector.selectListUsers);
  const success = useSelector(FriendsSelector.selectSuccess);

  useEffect(() => {
    if (!drawer && showDropdown) {
      setShowDropdown(false);
    }
    if (getListUsers.length && drawer) {
      setShowDropdown(true);
    }
  }, [drawer, getListUsers]);

  const debouncedSearch = _.debounce((value: string) => {
    dispatch(ChatAppSlice.actions.searchUsers(value));
  }, 500);

  const handleSearch = (value: string) => {
    if (!value || value === '' || value.length > 20) {
      dispatch(ChatAppSlice.actions.clearListUsers());
      return;
    }
    debouncedSearch(value);
  };

  const handleAddFriend = (row: any) => {
    dispatch(FriendsSlice.actions.addFriend({ friendId: row._id }));
  };

  const renderAutoComplete = () => {
    if (!getListUsers.length) return [];
    return getListUsers.map((row, idx) => ({
      value: row.id,
      label: (
        <Menu.Item key={idx} className="subMenu" onClick={() => handleAddFriend(row)}>
          <span className="dpl_al_center">
            <Avatar size={20} className="bg_green" src={row.avatar !== '' ? row.avatar : null}>
              {AppHelper.convertFullName(row.fullName)}
            </Avatar>
            <span className="account">{row.fullName}</span>
          </span>
          {!row.isFriend && <UserAddOutlined className="icon_add_friend" />}
        </Menu.Item>
      ),
    }));
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
            open={showDropdown}
            dropdownMatchSelectWidth={252}
            style={{ width: '100%' }}
            options={renderAutoComplete()}
            onSearch={handleSearch}>
            <Input
              className="mg-bottom"
              prefix={<SearchOutlined className="site-form-item-icon" />}
            />
          </AutoComplete>
          {listFriends.length ? (
            listFriends
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
    </Drawer>
  );
}
