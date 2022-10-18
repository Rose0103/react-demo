import { Button, Table,Modal} from "antd";
import {
    DeleteOutlined,
} from '@ant-design/icons'
import axios from "axios";
import React, { useEffect, useState } from "react";
const { confirm } = Modal;


export default function NewsCategory() {

    const [dataSource,setDataSource] = useState([])

    useEffect(() => {
       axios.get(`/categorries`).then(res => {
        console.log(res);
        const list = res.data
        setDataSource(list)
       })
    },[])
    
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
        // axios.delete(`/categorries/${row.id}`)
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
            title: '栏目名称',
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
                 <Button danger shape="circle" icon={<DeleteOutlined />} onClick={()=> showDeleteConfirm(row)}></Button>
               </div>
            ),
          }
    ]
    return (
        <Table columns={columns} dataSource={dataSource} rowKey={(row)=>row.id} pagination={{pageSize:8}}/>
    )
}