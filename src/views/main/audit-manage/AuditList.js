import { Button, Table, Tag,notification } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AuditList() {

    const navigate = useNavigate()
    const [dataSource,setDataSource] = useState([])

    const { username } = JSON.parse(localStorage.getItem('token'))

    useEffect(()=> {
        axios(`/news?author=${username}&auditState_ne=0&publishState_lte=1&_expand=category`).then(res => {
            console.log(res.data);
            setDataSource(res.data)
        })
    },[username])

    // 发布
    const handleRelease = (row) => {
        console.log(row);
        axios.patch(`/news/${row.id}`,{
            publishState: 2
        }).then(res => {
            navigate('/publish-manage/published')
            notification.info({
                message: `通知 `,
                description:`您可以到 【发布管理/已发布】 中查看您的新闻`,placement:'bottomRight'
              });
        })
    }

    // 撤销
    const handleRevoke = (row) => {
        console.log(row);
        setDataSource(dataSource.filter(data=>data.id !== row.id))
        axios.patch(`/news/${row.id}`,{
            auditState: 0
        }).then(res => {
            notification.info({
                message: `通知 `,
                description:`您可以到 【草稿箱】 中查看您的新闻`,placement:'bottomRight'
              });
        })
    }

    // 修改
    const handleUpdate = (row) => {
        console.log(row);
        navigate(`/news-manage/update/${row.id}`,{
            replace:false,
            state:{
                row
            }
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
            title: '审核状态',
            dataIndex: 'auditState',
            key: 'auditState',
            render:(auditState) => {
                const auditStateList = ['草稿箱','审核中','已通过','未通过']
                const auditStateColor = ['','orange','green','red']
                return <Tag color={auditStateColor[auditState]}>{auditStateList[auditState]}</Tag> 
            }
          },
          {
            title: '操作',
            key: '操作',
            render: (row) => (
               <div>
                {
                    row.auditState === 2 && <Button danger  onClick={() =>handleRelease(row) }>发布</Button>
                }
                {
                    row.auditState === 1 && <Button  onClick={()=> handleRevoke(row) }>撤销</Button> 
                }
                {
                    row.auditState === 3 && <Button type="primary"  onClick={()=> handleUpdate(row) }>修改</Button>
                }
               </div>
            ),
          }
    ]

    return (
        <Table  columns={columns} dataSource={dataSource} rowKey={(row)=>row.id} pagination={{pageSize:8}}></Table>
    )
}