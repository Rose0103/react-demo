import React, { useEffect, useState } from 'react'
import { Table,Button, Divider,Modal,Tree  } from 'antd';
import axios from 'axios';
import { BarsOutlined, DeleteOutlined } from '@ant-design/icons';
const { confirm } = Modal;

export default function RoleList() {

  const [dataSource, setDataSource] = useState([])
  const [visible, setVisible] = useState(false);
  const [treeData, setTreeData] = useState([])
  const [currentRigths, setCurrentRigths] = useState([])
  const [currentId, setCurrentId] = useState(0)



  useEffect(()=> {
    // 获取所有角色列表
    axios.get('/roles').then(res=> {
      setDataSource(res.data)
    })
  },[])

  useEffect(() => {
    // 获取所有权限列表
    axios.get("/rights?_embed=children").then(res => {
      const list = res.data
      list.forEach(item => {
        if(item?.children.length === 0) {
            item.children = ""
        }
      })
      setTreeData(list)
    })
  },[])
 

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: '角色名称',
      dataIndex: 'roleName',
      key: 'roleName',
    },
    {
      title: '操作',
      key: '操作',
      render: (row) =>{
        return <div>
           <Button  type="primary" shape="circle" icon={<BarsOutlined />} onClick={() => { setVisible(true); setCurrentRigths(row.rights); setCurrentId(row.id)}}/>
           <Divider type="vertical"/>
           <Button  shape="circle" icon={<DeleteOutlined />} danger  onClick={()=> showDeleteConfirm(row)}/>
        </div>
      }
    },
  ];


  // 模态框确定按钮
  const handleOK = () => {
    console.log(currentRigths);
    setVisible(false);
    setDataSource(dataSource.map(item => {
      console.log(item.id);
      if (item.id === currentId) {
        return {
          ...item,
          rights: currentRigths
        }
      }
      return item
    }))

    //删除接口
    axios.patch(`/roles/${currentId}`,{rights:currentRigths})
  };

  const onCheck = (checkedKeys, info) => {
    setCurrentRigths(checkedKeys.checked)
  };

  // 删除确认框
  const showDeleteConfirm = (row) => {
    console.log(row);
    confirm({
      title: '你是否确定要删除**' +row.roleName + '**这个角色吗?',
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

  //删除方法
  const deleteMethed = (row) => {
    console.log(row);
    // setDataSource(dataSource.filter(item=>item.id !== row.id))
    // axios.delete(`/roles/${row.id}`)
  }
  

  return (
     <div>
       <Table dataSource={dataSource} columns={columns} rowKey={(row)=>row.id}/>
       <Modal title="分配权限" visible={visible} onOk={handleOK} onCancel={() => setVisible(false)} okText="确认" cancelText="取消">
          <Tree
            checkable
            checkStrictly={true}
            checkedKeys={currentRigths}
            onCheck={onCheck}
            treeData={treeData}
          />
       </Modal>
     </div>
  )
}

