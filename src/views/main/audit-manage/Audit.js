import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Divider, notification, Table } from "antd";
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
            ...list.filter(item=>item.author === username), //展示他自己
            ...list.filter(item=>item.region === region && roleObj[item.roleId]==='editor')
          ])
        })
    },[roleId,region,username])

    const handleAudit = (row,auditState,publishState) => {
        console.log(row);
        setDataSource(dataSource.filter(item=>item.id!==row.id))
        axios.patch(`/news/${row.id}`,{
            auditState,publishState
        }).then(res => {
            notification.info({
                message: `通知 `,
                description:`您可以到 【审核管理/审核列表】 中查看您的新闻`,placement:'bottomRight'
              });
        })
    }
    
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
               <Button type="primary" onClick={()=> handleAudit(row,2,1)}>通过</Button>
               <Divider type="vertical" />
               <Button danger  onClick={()=> handleAudit(row,3,0)}>驳回</Button>
             </div>
          ),
        }
  ]


    return (
        <Table  columns={columns} dataSource={dataSource} rowKey={(row)=>row.id} pagination={{pageSize:8}}></Table>
    )
} 