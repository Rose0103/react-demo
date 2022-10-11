/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DownOutlined,
} from '@ant-design/icons';

import { Layout,Dropdown,Space,Menu,Avatar  } from 'antd';
const {  Header } = Layout;

export default function TopHeader() {

  // 状态
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate();

  const { role:{roleName},username} = JSON.parse(localStorage.getItem('token'))

  const menu = (
    <Menu >
      <Menu.Item>{roleName}</Menu.Item>
      <Menu.Item danger onClick={()=> {
        localStorage.removeItem('token')
        navigate('/login',{replace: true})
      }}>退出</Menu.Item>
    </Menu>
  );
  
   
  return (
    <Header className="site-layout-background" style={{ padding: '0px 16px' }}>
      {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
        className: 'trigger',
        onClick: () => setCollapsed(!collapsed),
      })}
      <div style={{float: 'right'}}>
        <span style={{marginRight: '20px'}}>欢迎<span style={{color:'#1890ff'}}>{username}</span>回来</span>
        <Dropdown overlay={menu}>
          <a onClick={e => e.preventDefault()}>
            <Space>
             <Avatar size="large" src="https://img2.baidu.com/it/u=1458763226,2076500773&fm=253&fmt=auto&app=138&f=JPEG?w=400&h=400" />
              <DownOutlined />
            </Space>
          </a>
        </Dropdown>
      </div>
    </Header>
  )
}
