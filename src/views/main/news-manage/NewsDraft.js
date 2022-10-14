import { Button, Table,Divider,Modal, notification} from "antd";
import {
    DeleteOutlined,
    EditOutlined,
    UploadOutlined
} from '@ant-design/icons'
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const { confirm } = Modal;


export default function NewsDraft() {

    const [dataSource,setDataSource] = useState([])
    const { username } = JSON.parse(localStorage.getItem('token'))
    const navigate = useNavigate()

    useEffect(() => {
       axios.get(`/news?author=${username}&auditState=0&_expand=category`).then(res => {
        console.log(res);
        const list = res.data
        setDataSource(list)
       })
    },[username])

    //编辑按钮
    const handleUpdate = (row) => {
        console.log(row);
        navigate(`/news-manage/update/${row.id}`, {
          replace:false,
          state:{
            row
          }
        })
    }
    
    //删除按钮
    const showDeleteConfirm = (row) => {
        console.log(row);
        confirm({
            title: '你是否确定要删除**' +row.title + '**这个用户吗?',
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
              console.log('OK');
              deleteMethed(row)
            },
            onCancel() {
              console.log('Cancel');
            },
          });
    }

    // 删除方法调接口
    const deleteMethed = (row) => {
        console.log(row);
        setDataSource(dataSource.filter(data=> data.id !== row.id))
        // axios.delete(`/news/${row.id}`)
    }

    //发布按钮
    const handleSubmit = (row) => {
        console.log(row);
        axios.patch(`/news/${row.id}`,{
          auditState:1
        }).then(res=> {
          navigate('/audit-manage/list')

          notification.info({
              message: `通知 `,
              description:`您可以到 【审核管理/审核列表】中查看您的新闻`,placement:'bottomRight'
            });
      })
    }
    
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            render:(id) => {
                return <b>{id}</b>
            }
          },
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
                return category.title
            }
          },
          {
            title: '操作',
            key: '操作',
            render: (row) => (
               <div>
                 <Button type="primary" shape="circle" icon={<EditOutlined />} onClick={() => handleUpdate(row)}></Button>
                 <Divider type="vertical" />
                 <Button danger shape="circle" icon={<DeleteOutlined />} onClick={()=> showDeleteConfirm(row)}></Button>
                 <Divider type="vertical" />
                 <Button type="primary" shape="circle" icon={<UploadOutlined />}  onClick={()=> handleSubmit(row)}></Button>
               </div>
            ),
          }
    ]
    return (
        <Table columns={columns} dataSource={dataSource} rowKey={(row)=>row.id} pagination={{pageSize:8}}/>
    )
}