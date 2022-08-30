import React from 'react'
import TopHeader from '../../components/layout/TopHeader';
import SideMenu from '../../components/layout/SideMenu';
import { Routes,Route,Navigate } from 'react-router-dom';
import Home from './home/Home';
import UserList from './user-manage/UserList';
import RoleList from './right-manage/RoleList';
import RightList from './right-manage/RightList';
import NoPermisson from './nopermisson/NoPermisson';

import './main.css'

import { Layout } from 'antd';
const { Content } = Layout;

export default function Main() {
  return (
    <Layout>
      <SideMenu></SideMenu>
      <Layout className="site-layout">
          <TopHeader></TopHeader>
          {/* 二级路由 */}
          <Content
            className="site-layout-background"
            style={{
              margin: '24px 16px',
              padding: 24,
              minHeight: 280,
              overflow:"auto"
            }}
          >
            <Routes>
              <Route path='/home' element={<Home/>}></Route>
              <Route path='/user-manage/list' element={<UserList/>} ></Route>
              <Route path='/right-manage/role/list' element={<RoleList/>}></Route>
              <Route path='/right-manage/right/list' element={<RightList/>}></Route>

              {/* 重定向 */}
              <Route path="/" element={<Navigate to="/home" replace={true}/>} />
              <Route path='*' element={<NoPermisson />}/>
            </Routes>
          </Content>

      </Layout>
     
    </Layout>
  )
}