import React, { useEffect, useState,useRef } from 'react'
import axios from 'axios';
import { Table, Divider,Button,Modal,Switch  } from 'antd'
import {
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons'
import UserForm from '../../../components/user-manage/UserForm';
const { confirm } = Modal;


export default function UserList() {

  const [dataSource,setDataSource ] = useState([]) // 表格数据
  const [open, setOpen] = useState(false);  // 打开模态框
  const [modalTitle, setModalTitle] = useState("添加用户");  // 打开模态框标题
  const [isUpdateDisabled, setIsUpdateDisabled] = useState(false);  // 控制区域框禁用
  const [updateRow, setUpdateRow] = useState(null) //保存更新的当前的一行

  const [regionDisable, setRegionDisable] = useState(false);  // 筛选控制区域框禁用

  
  const [regionList,setRegionList ] = useState([]) // 区域数据
  const [roleList,setRoleList ] = useState([]) // 角色数据

  const addForm = useRef(null)


    const {roleId,region,username}  = JSON.parse(localStorage.getItem('token'))

    useEffect(() => {

      const roleObj = {
        '1':'superadmin',
        '2':'admin',
        '3':'editor'
      }

      // 获取所有用户列表
      axios.get("/users?_expand=role").then(res => {
        const list = res.data
        setDataSource((roleObj[roleId]==='superadmin')?list:[
          ...list.filter(item=>item.username === username), //展示他自己
          ...list.filter(item=>item.region === region && roleObj[item.roleId]==='editor')
        ])
      })
    },[roleId,region,username])

    useEffect(() => {
      // 获取所有区域数据
      axios.get("/regions").then(res => {
        const list = res.data
        setRegionList(list)
      })
    },[])

    useEffect(() => {
      // 获取所有角色数据
      axios.get("/roles").then(res => {
        const list = res.data
        setRoleList(list)
      })
    },[])

  const columns =[
    {
      title: '区域',
      dataIndex: 'region',
      filters: [
        ...regionList.map(item => ({
          text:item.title,
          value: item.value
        })),
        {
          text: '全球',
          value: '全球'
        }
      ],
      onFilter: (value,item) => {
        if (value === '全球') {
          return item.region === ''
        }
        return item.region === value
      },
      render: (region) => {
        return <b>{region==='' ? '全球': region}</b>
      }
    },
    {
      title: '角色名称',
      dataIndex: 'role',
      render: (role) => {
        return role?.roleName
      }
    },
    {
      title: '用户名',
      dataIndex: 'username',
    },
    {
      title: '用户状态',
      dataIndex: 'roleState',
      render: (roleState,item) => {
        return <Switch checked={roleState} disabled={item.default} onChange={()=>handleChange(item)}></Switch>
      }
    },
    {
      title: '操作',
      key: '操作',
      render: (row) => {
       return  <div>
          <Button type="primary" shape="circle" icon={<EditOutlined />}  disabled={row.default} onClick={()=> handleUpdate(row)}/>
          <Divider type="vertical" />
          <Button  shape="circle" icon={<DeleteOutlined />} danger  onClick={()=> showDeleteConfirm(row)} disabled={row.default}/>
        </div>
      },
    },
  ]
  
  // 修改状态
  const handleChange = (item) => {
    console.log(item);
    item.roleState = !item.roleState
    setDataSource([...dataSource])
    axios.patch(`/users/${item.id}`,{
      roleState: item.roleState
    })
  }

  // 编辑按钮
  const handleUpdate = (row) => {
   setTimeout(()=> {
    setModalTitle("编辑用户")
    setOpen(true)
    if (roleId === 1) {    // 判断是否是超级管理员，如果是就不禁用区域选择框，反之
      setRegionDisable(false)
    }else {
      setRegionDisable(true)
    }
    if (row.roleId === 1) {
      //禁用
      setIsUpdateDisabled(true)
    }else {
      // 取消禁用
      setIsUpdateDisabled(false)
    }
    addForm.current.setFieldsValue(row)
   },0)
   // 保存更新的这一行
   setUpdateRow(row)
  }
  //删除按钮
  const showDeleteConfirm = (row) => {
    confirm({
      title: '你是否确定要删除**' +row.username + '**这个用户吗?',
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
  
  // 新增按钮
  const handleAdd = () => {
    setTimeout(() => {
      setModalTitle('添加用户')
      setOpen(true)
      setIsUpdateDisabled(false)
      setRegionDisable(false)
      addForm.current.resetFields() //重置表单
    }, 0);
  }
  // 删除方法调接口
  const deleteMethed = (row) => {
    console.log(row);
    // setDataSource(dataSource.filter(data=> data.id !== row.id))
    // axios.delete(`/users/${row.id}`)
  }

  //确定按钮
  const handleFormOK = (title) => {
    console.log(title);
    if (title === '添加用户') {
      addFormOK()
    }else {
      updateFormOK()
    }
  }

  // 新增
  const addFormOK = () => {
    //  console.log('ok',addForm);
     addForm.current.validateFields().then(val => {
      console.log(val);
      setOpen(false) //隐藏模态框
      addForm.current.resetFields() //重置表单
      // post 到后端，生成id，再设置dataSource,方便后面的删除和更新
      axios.post(`/users`,{
        ...val,
        "roleState": true,
        "default": false,
      }).then(res => {
        console.log(res.data);
        setDataSource([...dataSource,{...res.data,role:roleList.filter(item => item.id === val.roleId)[0]}])
      })
     }).catch(err => {
      console.log(err);
     })
  }

  // 更新
  const updateFormOK = () => {
     console.log('ok',addForm);
     addForm.current.validateFields().then(val => {
      console.log(val);
      setOpen(false) //隐藏模态框
      setIsUpdateDisabled(false)
      addForm.current.resetFields() //重置表单
      setDataSource(dataSource.map(item => {
        if (item.id === updateRow.id) {
          return {
            ...item,
            ...val,
            role: roleList.filter(data => data.id === val.roleId)[0]
          }
        }
        return item
      }))

      setIsUpdateDisabled(!isUpdateDisabled)

      // patch 到后端，生成id，再设置dataSource,方便后面的删除和更新
      axios.patch(`/users/${updateRow.id}`,val)
     }).catch(err => {
      console.log(err);
     })
  }

  return (
    <div> 
      <Button type='primary' onClick={()=>handleAdd()}>添加用户</Button>
      <Table dataSource={dataSource} columns={columns} pagination={{pageSize: 8}} rowKey={item => item.username} />
      <Modal
        visible={open}
        title={modalTitle}
        okText="确定"
        cancelText="取消"
        onCancel={()=>{
          setOpen(false)
          setIsUpdateDisabled(!isUpdateDisabled)
        }}
        onOk={() => handleFormOK(modalTitle)}
      >
      <UserForm ref={addForm} regionList={regionList} roleList={roleList} isUpdateDisabled={isUpdateDisabled} regionDisable={regionDisable}></UserForm>
      </Modal>
    </div>
  )
}
