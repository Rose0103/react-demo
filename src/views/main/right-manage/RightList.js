import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Table, Divider,Tag,Button,Modal,Popover,Switch  } from 'antd'
import {
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons'

const { confirm } = Modal;

export default function RightList() {

  const [dataSource,setDataSource ] = useState([])


    useEffect(() => {
      // 获取所有权限列表
      axios.get("/rights?_embed=children").then(res => {
        const list = res.data
        list.forEach(item => {
          if(item?.children.length === 0) {
              item.children = ""
          }
        })
        setDataSource(list)
      })
    },[])

  const columns =[
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: '权限名称',
      dataIndex: 'title',
    },
    {
      title: '权限路径',
      dataIndex: 'key',
      render: key => {
        return <Tag color='orange'>{key}</Tag>
      }
    },
    {
      title: '操作',
      key: '操作',
      render: (row) => {
       return  <div>
          <Popover content={content(row)} title="配置项" trigger={row.pagepermisson === undefined ? '' : 'click'}>
            <Button type="primary" shape="circle" icon={<EditOutlined />} disabled={row.pagepermisson === undefined}  />
          </Popover>
          <Divider type="vertical" />
          <Button  shape="circle" icon={<DeleteOutlined />} danger  onClick={()=> showDeleteConfirm(row)} />
        </div>
      },
    },
  ]
  const content = (row) => (
    <div>
       <Switch checkedChildren="开" unCheckedChildren="关" defaultChecked checked={row.pagepermisson}  onChange={()=> changePerMisson(row)}/>
    </div>
  );

  const changePerMisson = (row) => {
    console.log(row);
    row.pagepermisson = row.pagepermisson === 1 ? 0 : 1
    setDataSource([...dataSource])

    if (row.grade === 1) {
      axios.patch(`/rights/${row.id}`,{pagepermisson:row.pagepermisson})
    }else {
      axios.patch(`/children/${row.id}`,{pagepermisson:row.pagepermisson})
    }
  };

  //删除按钮
  const showDeleteConfirm = (row) => {
    confirm({
      title: '你是否确定要删除**' +row.title + '**这个权限吗?',
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
    // setDataSource(dataSource.filter(data=> data.id !== row.id))
    // axios.delete(`/rights/${row.id}`)
  }

  return (
    <div> 
      <Table dataSource={dataSource} columns={columns} pagination/>
    </div>
  )
}
