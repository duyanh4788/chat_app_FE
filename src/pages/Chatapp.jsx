/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import './scss/chatapp.css'
import { Layout, Menu, Breadcrumb, notification, Input, Tooltip, Form, Row, Col, Avatar } from 'antd';
import { RollbackOutlined, UserOutlined, SmileOutlined, SendOutlined, HeatMapOutlined } from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';
import io from 'socket.io-client';
// import { useSelector } from 'react-redux';
import Qs from 'qs'

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

export const Chatapp = () => {
  const [form] = Form.useForm();
  const [collapsed, setCollapsed] = useState(false)
  const [userList, setUserList] = useState([])
  const [errorAcknow, setErrorAcknow] = useState(null)
  const [rooms, setRoom] = useState(null)
  const [userName, setUserName] = useState(null)
  const [userId, setUserId] = useState(null)
  const [sendMessage, setSendMessage] = useState(null)
  const [sendLocation, setSendLocation] = useState(null)
  const [receiverMessage, setReceiverMessage] = useState(null)
  const [receiverArrayMessage, setReceiverArrayMessage] = useState([])

  const queryString = useLocation()

  const PORRT = 'localhost:5000';
  const socket = io(PORRT);

  useEffect(() => {
    const { room, userName } = Qs.parse(queryString.search, { ignoreQueryPrefix: true })
    setRoom(room)
    setUserName(userName)
    // join room
    socket.emit('join room', { room, userName })
    // render list member
    socket.on('send list client inside room', (userList) => {
      setUserId(socket.id)
      getListUser()
    })
    // semd message
    socket.emit("send message", sendMessage, acknowLedGements)
    // reciver message
    socket.on('send message', async (receiverMessage) => {
      await setReceiverMessage(receiverMessage)
    })
    socket.on('send array message', async (arrayMessage) => {
      await setReceiverArrayMessage(arrayMessage)
    })
    // send location
    socket.emit('send location', sendLocation)
    // disconecet
    socket.on('disconnect', () => {
      return () => {
        socket.disconnect()
      }
    })

  }, [PORRT, queryString.search, sendMessage, sendLocation])

  const getListUser = () => {
    fetch('http://localhost:5000/api/v1/listUser')
      .then((result) => {
        if (result.ok) {
          return result.json()
        }
        throw result
      })
      .then((data) => {
        setUserList(data)
      })
      .catch(err => console.log("err", err))
  }

  useEffect(() => {
    // display notify
    socket.on('send message notify', (message) => {
      openNotificationJoin(message)
    })
  }, [])

  useEffect(() => {
    if (errorAcknow !== null) {
      openNotificationAcknow()
    }
  })

  useEffect(() => {
    if (receiverMessage && receiverMessage !== null) {
      setErrorAcknow(null)
    }
  })

  const openNotificationJoin = (notify) => {
    notification.open({
      message: `${notify}`,
      icon: <SmileOutlined style={{ color: '#108ee9' }} />,
    });
  };

  const openNotificationAcknow = () => {
    notification.open({
      message: `${errorAcknow}`,
      icon: <SmileOutlined style={{ color: '#e91010' }} />
    });
  };

  const acknowLedGements = (error) => {
    if (error) {
      setErrorAcknow(error)
    }
  }

  const onSendMessage = (e) => {
    if (e.message !== "") {
      setSendMessage(e.message)
    }
  }

  const shareLocation = () => {
    if (!navigator.geolocation) {
      return ('Browser Not Support Location')
    }
    navigator.geolocation.getCurrentPosition((position) => {
      const location = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      }
      setSendLocation(location)
    })
  }

  const renderMessage = () => {
    if (receiverArrayMessage) {
      return receiverArrayMessage.map((row, idx) => {
        if (row.userId !== userId) {
          return (
            <div key={idx} className='memberChat'>
              <div style={{ display: 'flex' }}>
                <div className='avatar'><Avatar style={{ backgroundColor: '#87d068' }}>{row.userRoom}</Avatar></div>
                <div className='chat'>{row.message}</div>
              </div>
              <p className='time'>{row.createAt}</p>
            </div>
          )
        }
        return (
          <div key={idx} className='myChat'>
            <div className='warpMyChat'>
              <div style={{ display: 'flex' }}>
                <div className='chat'>{row.message}</div>
                <div className='avatar'><Avatar style={{ backgroundColor: '#87d068' }}>{row.userRoom}</Avatar></div>
              </div>
              <p className='time'>{row.createAt}</p>
            </div>
          </div>
        )
      })
    }
  }

  const onCollapse = (collapsed) => {
    setCollapsed(collapsed)
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
        <div className="logo" />
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
          <Menu.Item key={userList.length + 1} icon={<RollbackOutlined />}>
            <Link to='/'>Come Back</Link>
          </Menu.Item>
          <SubMenu key="sub1" icon={<UserOutlined />} title="Member">
            {userList.map((item, index) => {
              return (
                <Menu.Item key={index}>{item.userName}</Menu.Item>
              )
            })}
          </SubMenu>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ padding: 0 }}>Room Chat : {rooms?.toUpperCase()}</Header>
        <Content style={{ margin: '0 16px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>
              <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} /> <span className='account'>{userName}</span>
            </Breadcrumb.Item>
          </Breadcrumb>
          <div className="site-layout-background" style={{ padding: 24, minHeight: 360, borderRadius: '10px' }}>
            <Row className='rowChat'>
              <Col span={24}>
                {renderMessage()}
              </Col>
            </Row>
          </div>
          <Form form={form} name="horizontal_login" onFinish={onSendMessage} style={{ padding: '20px 0', borderRadius: '5px' }}>
            <Form.Item name="message">
              <Input
                placeholder="Enter Message"
                prefix={<SendOutlined type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                suffix={
                  <React.Fragment>
                    <Tooltip title="Send Message" htmlType="submit">
                      <SendOutlined type="info-circle" style={{ color: 'rgba(0,0,0,.45)', marginRight: '10px' }} />
                    </Tooltip>
                    <Tooltip title="Share Location" htmlType="submit">
                      <HeatMapOutlined type="info-circle" style={{ color: 'rgba(0,0,0,.45)' }} onClick={shareLocation} />
                    </Tooltip>
                  </React.Fragment>
                }
              />
            </Form.Item>
          </Form>
        </Content>
        <Footer style={{ textAlign: 'center' }}>Vũ Duy Anh Design ©2021 Created Chat_App</Footer>
      </Layout>
    </Layout>
  )
}

