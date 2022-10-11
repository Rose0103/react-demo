import React, { forwardRef,useState,useEffect } from 'react'
import { Form,Input,Select  } from 'antd'
const { Option } = Select;


const UserForm = forwardRef((props,ref) => {
  const [isDisabled, setisDisabled] = useState(false)

  // 编辑用户时控制区域禁用
  useEffect(() => {
    setisDisabled(props.isUpdateDisabled)
  },[props.isUpdateDisabled])

  const {roleId,region} = JSON.parse(localStorage.getItem('token'))
  const roleObj = {
    '1':'superadmin',
    '2':'admin',
    '3':'editor'
  }
  //筛选区域禁用 
  const checkRegionDisabled = (item) => {
    if (props.regionDisable) {  // 为true的时候就是点击了编辑
      if(roleObj[roleId]==='superadmin') {  // 如果是超级管理员
        return false
      }else {
        return true
      }
    }else{  // 是添加
      if(roleObj[roleId]==='superadmin') { 
        return false
      }else {
        return item.value !== region
      }
    }
  }

  //筛选角色禁用 
  const checkRoleDisabled = (item) => {
    if (props.regionDisable) {  // 为true的时候就是点击了编辑
      if(roleObj[roleId]==='superadmin') {  // 如果是超级管理员
        return false
      }else {
        return true
      }
    }else{  // 是添加
      if(roleObj[roleId]==='superadmin') { 
        return false
      }else {
        return roleObj[item.id] !== 'editor'
      }
    }
  }
  
  return (
    <Form
        layout="vertical"
        ref={ref}
      >
        <Form.Item
          name="username"
          label="用户名"
          rules={[
            {
              required: true,
              message: 'Please input the username of collection!',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="password"
          label="密码"
          rules={[
            {
              required: true,
              message: 'Please input the password of collection!',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="region"
          label="区域"
          rules={isDisabled?[]:[
            {
              required: true,
              message: 'Please input the region of collection!',
            },
          ]}
        >
           <Select placeholder="select your region" disabled={isDisabled}>
            {
              props.regionList.map(item => 
                 <Option value={item.value} key={item.id} disabled={checkRegionDisabled(item)}>{item.title}</Option>
              )
            }
          </Select>
        </Form.Item>
        <Form.Item
          name="roleId"
          label="角色"
          rules={[
            {
              required: true,
              message: 'Please input the roleId of collection!',
            },
          ]}
        >
           <Select placeholder="select your roleId" onChange={(value) => {
            console.log(value);
            if (value === 1) {  //如果选中的是超级管理员，就要禁用区域选择框把region置为空字符串
              setisDisabled(true)
              ref.current.setFieldsValue({region: ''})
            }else {
              setisDisabled(false)
            }
           }}>
            {
              props.roleList.map(item => 
                <Option value={item.id} key={item.id} disabled={checkRoleDisabled(item)}>{item.roleName}</Option>  
              )
            }
          </Select>
        </Form.Item>
      </Form>
  )
})

export default  UserForm