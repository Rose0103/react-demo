/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react'

import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DownOutlined,
} from '@ant-design/icons';

import { Layout,Dropdown,Space,Menu,message,Avatar  } from 'antd';
const {  Header } = Layout;

export default function TopHeader() {

  // 状态
  const [collapsed, setCollapsed] = useState(false)

  const onClick = ({ key }) => {
    message.info(`Click on item ${key}`);
  };

  const menu = (
    <Menu onClick={onClick}>
      <Menu.Item key="1">个人信息</Menu.Item>
      <Menu.Item key="2" danger>退出</Menu.Item>
    </Menu>
  );
  
   
  return (
    <Header className="site-layout-background" style={{ padding: '0px 16px' }}>
      {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
        className: 'trigger',
        onClick: () => setCollapsed(!collapsed),
      })}
      <div style={{float: 'right'}}>
        <span style={{marginRight: '20px'}}>欢迎admin回来</span>
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
