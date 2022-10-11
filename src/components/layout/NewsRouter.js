import React, { useEffect, useState } from "react";
import { Routes,Route,Navigate } from 'react-router-dom';
import Home from "../../views/main/home/Home";
import NewsAdd from "../../views/main/news-manage/NewsAdd";
import NewsDraft from "../../views/main/news-manage/NewsDraft";
import NewsCategory from "../../views/main/news-manage/NewsCategory";

import NoPermisson from "../../views/main/nopermisson/NoPermisson";
import RightList from "../../views/main/right-manage/RightList";
import RoleList from "../../views/main/right-manage/RoleList";
import UserList from "../../views/main/user-manage/UserList";
import Audit from "../../views/main/audit-manage/Audit";
import AuditList from "../../views/main/audit-manage/AuditList";
import Unpublished from "../../views/main/publish-manage/Unpublished";
import Published from "../../views/main/publish-manage/Published";
import Sunset from "../../views/main/publish-manage/Sunset";
import axios from "axios";



const LocalRouterMap = {
    '/home':<Home/>,
    '/user-manage/list':<UserList/>,
    '/right-manage/role/list':<RoleList/>,
    '/right-manage/right/list':<RightList/>,
    '/news-manage/add':<NewsAdd/>,
    '/news-manage/draft':<NewsDraft/>,
    '/news-manage/category':<NewsCategory/>,
    '/audit-manage/audit':<Audit/>,
    '/audit-manage/list':<AuditList/>,
    '/publish-manage/unpublished':<Unpublished/>,
    '/publish-manage/published':<Published/>,
    '/publish-manage/sunset':<Sunset/>,
}


export default function NewsRouter() {

    const [backRouterList,setBackRouterList] = useState([])

    useEffect(() => {
        Promise.all([
            axios.get('/rights'),
            axios.get('/children'),
        ]).then(res=> {
            console.log(res);
            setBackRouterList([...res[0].data,...res[1].data])
        })
    },[])


    const {role:{rights}} = JSON.parse(localStorage.getItem('token'))
    const checkRoute =(item) => {
        //判断权限列表中的配置项有没有 
        return LocalRouterMap[item.key]  && item.pagepermisson
    }

    const checkUserPermission = (item) => {
        // 判断当前登录用户权限列表是否包含
        return rights.includes(item.key)
    }
    return (
        <Routes>
            {
                backRouterList.map(item => {
                  if (checkRoute(item) && checkUserPermission(item)) {  //是否有权限，查看当前登录用户有没有这个权限
                    return <Route path={item.key} key={item.key} element={LocalRouterMap[item.key]} ></Route>
                  }
                  return null
                })
            }
            {/* <Route path='/home' element={<Home/>}></Route>
            <Route path='/user-manage/list' element={<UserList/>} ></Route>
            <Route path='/right-manage/role/list' element={<RoleList/>}></Route>
            <Route path='/right-manage/right/list' element={<RightList/>}></Route> */}

            {/* 重定向 */}
            <Route path="/" element={<Navigate to="/home" replace={true}/>} />
            {
                // 解决当路由是[],出现404闪烁问题
                backRouterList.length > 0 && <Route path='*' element={<NoPermisson />}/>
            }
        </Routes>
    )
}