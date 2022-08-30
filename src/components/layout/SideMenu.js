import {useNavigate,useLocation} from 'react-router-dom'
import {
  HomeOutlined,
  UserOutlined,
  AppstoreOutlined,
  SettingOutlined,
  ReadOutlined,
  WalletOutlined,
  UploadOutlined
} from '@ant-design/icons';

import { Layout, Menu  } from 'antd';
import './index.css'
import { useEffect, useState } from 'react';
import axios from 'axios';

const {  Sider } = Layout;
const { SubMenu } = Menu;


// 模拟菜单数据
// const menuList = [
//   {
//     key:'/home',
//     title:'首页',
//     icon: <HomeOutlined />,
//   },
//   {
//     key:'/user-manage',
//     title:'用户管理',
//     icon: <UserOutlined />,
//     children: [
//       {
//         key:'/user-manage/list',
//         title:'用户列表',
//         icon: <AppstoreOutlined />,
//       }
//     ]
//   },
//   {
//     key:'/right-manage',
//     title:'权限管理',
//     icon: <SettingOutlined />,
//     children: [
//       {
//         key:'/right-manage/role/list',
//         title:'角色管理',
//         icon: <AppstoreOutlined />,
//       },
//       {
//         key:'/right-manage/right/list',
//         title:'权限管理',
//         icon: <AppstoreOutlined />,
//       }
//     ]
//   }
// ]


// 映射图标
const iconList = {
  '/home': <HomeOutlined />,
  '/user-manage': <UserOutlined />,
  '/user-manage/list': <AppstoreOutlined />,
  '/right-manage':<SettingOutlined />,
  '/right-manage/role/list':<AppstoreOutlined />,
  '/right-manage/right/list': <AppstoreOutlined />,
  '/news-manage':<ReadOutlined />,
  '/news-manage/add':<AppstoreOutlined />,
  '/news-manage/draft':<AppstoreOutlined />,
  '/news-manage/category':<AppstoreOutlined />,
  '/audit-manage':<WalletOutlined />,
  '/audit-manage/audit':<AppstoreOutlined />,
  '/audit-manage/list':<AppstoreOutlined />,
  '/publish-manage':<UploadOutlined />,
  '/publish-manage/unpublished':<AppstoreOutlined />,
  '/publish-manage/published':<AppstoreOutlined />,
  '/publish-manage/sunset':<AppstoreOutlined />,
}


export default  function SideMenu() {

  const [collapsed] = useState(false)
  const [menu, setMenu] = useState([])

  const navigate = useNavigate()
  const location = useLocation()
  const [defaultKey, setDefaultKey] = useState('')
  const [openKey, setOpenKey] = useState('')

  // 请求左侧数据
  useEffect(() => {
    axios.get("http://localhost:3000/rights?_embed=children").then(res => {
      console.log(res.data);
      setMenu(res.data)
    })
  },[])

  useEffect(()=> {
    let path = location.pathname==="/"?"/home":location.pathname;
      console.log(path,"path");
      setDefaultKey(path);
      const key = '/'+ path.split('/')[1]
      console.log(key);
      setOpenKey([key])
  }, [location.pathname])

  const checkPagePermisson = (item) => {
    return item.pagepermisson === 1
  }

  // 渲染左侧栏
  const renderMenu = (menuList) => {
    return menuList.map(item => {
    //  如果存在children
      if (item.children?.length>0 && checkPagePermisson(item)) {
        return <SubMenu key={item.key} icon={iconList[item.key]} title={item.title}>
            {renderMenu(item.children)}
        </SubMenu>
      }
      
      return checkPagePermisson(item) && <Menu.Item key={item.key} icon={iconList[item.key]} onClick={()=>{
        // 跳转路由
        navigate(item.key)
        setDefaultKey(item.key)
      }}>{item.title}</Menu.Item>
    })
  }

  return (
      <Sider trigger={null} collapsible  collapsed={collapsed} >
        <div className="logo">后台管理系统</div> 
        <Menu
          style={{ width: 200 }}
          selectedKeys={[defaultKey]}
          defaultSelectedKeys={[defaultKey]}
          openKeys={openKey}
          onOpenChange={(openKeys) => {
            console.log(openKeys);
            let keyArr = []
            if (openKeys.length > 0) {
                //取最后一项，最后一项才是你当前展开的菜单
                keyArr.push(openKeys[openKeys.length - 1])
            }
            console.log(keyArr);
            setOpenKey(keyArr);
          }}
          mode="inline"
          theme="dark"
        >
           {/* <Menu.Item key="1">Option 1</Menu.Item>
           <SubMenu
              key="sub4" 
              title={
                <span>
                  <SettingOutlined />
                  <span>Navigation Three</span>
                </span>
              }
            >
              <Menu.Item key="9">Option 9</Menu.Item>
              <Menu.Item key="10">Option 10</Menu.Item>
              <Menu.Item key="11">Option 11</Menu.Item>
              <Menu.Item key="12">Option 12</Menu.Item>
            </SubMenu> */}
            {renderMenu(menu)}
        </Menu> 
      </Sider>
  )
}


