import React,{ useEffect } from 'react'
import TopHeader from '../../components/layout/TopHeader';
import SideMenu from '../../components/layout/SideMenu';

import './main.css'

import { Layout } from 'antd';
import NewsRouter from '../../components/layout/NewsRouter';
import 'nprogress/nprogress.css'
import nProgress from 'nprogress';
const { Content } = Layout;

export default function Main() {

  nProgress.start()
  useEffect(() => {
    nProgress.done()
  })

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
           <NewsRouter></NewsRouter>
          </Content>

      </Layout>
     
    </Layout>
  )
}