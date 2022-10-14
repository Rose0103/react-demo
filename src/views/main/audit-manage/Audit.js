import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Divider, Table } from "antd";
export default function Audit() {
    const [dataSource,setDataSource] = useState([])

    const { roleId,region,username } = JSON.parse(localStorage.getItem('token'))

    useEffect(() => {

        const roleObj = {
          '1':'superadmin',
          '2':'admin',
          '3':'editor'
        }
  
        // 获取所有用户列表
        axios.get("/news?&auditState=1&_expand=category").then(res => {
          const list = res.data
          setDataSource((roleObj[roleId]==='superadmin')?list:[
            ...list.filter(item=>item.username === username), //展示他自己
            ...list.filter(item=>item.region === region && roleObj[item.roleId]==='editor')
          ])
        })
    },[roleId,region,username])
    
    const columns = [
        
        {
          title: '新闻标题',
          dataIndex: 'title',
          key: 'title',
          render:(title,item) => {
              return <a href={`#/news-manage/preview/${item.id}`}>{title}</a>
          }
        },
        
        {
          title: '作者',
          dataIndex: 'author',
          key: 'author',
        },
        {
          title: '新闻分类',
          dataIndex: 'category',
          key: 'category',
          render:(category) => {
              return <div>{category.title}</div>
          }
        },
        {
          title: '操作',
          key: '操作',
          render: (row) => (
             <div>
               <Button type="primary">通过</Button>
               <Divider type="vertical" />
               <Button danger>驳回</Button>
             </div>
          ),
        }
  ]


    return (
        <Table  columns={columns} dataSource={dataSource} rowKey={(row)=>row.id} pagination={{pageSize:8}}></Table>
    )
} 