import React from 'react'
import { Form, Input, Button, message   } from 'antd';
import { useNavigate } from 'react-router-dom';

import {
  UserOutlined,
  LockOutlined
} from '@ant-design/icons'

import './login.css'
import axios from 'axios';

export default function Login() {
  const navigate = useNavigate();

  const onFinish = (values) => {
    console.log('Success:', values);
    axios.get(`/users?username=${values.username}&password=${values.password}&roleState=true&_expand=role`).then(res => {
      console.log(res.data);
      if (res.data.length === 0) {
        message.error('用户名或密码不匹配')
      }else {
        localStorage.setItem('token',JSON.stringify(res.data[0]))
        navigate('/')
      }
    })
  };
  return (
    <div style={{ background: "#eee", height: "100%", overflow: "hidden" }}>
          <div className="login-container">
              <div className="login-title">后台管理系统</div>
              <Form
                  name="normal_login"
                  onFinish={onFinish}
              >
                  <Form.Item
                      name="username"
                      rules={[{ required: true, message: 'Please input your Username!' }]}
                  >
                      <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
                  </Form.Item>
                  <Form.Item
                      name="password"
                      rules={[{ required: true, message: 'Please input your Password!' }]}
                  >
                      <Input
                          prefix={<LockOutlined className="site-form-item-icon" />}
                          type="password"
                          placeholder="Password"
                      />
                  </Form.Item>

                  <Form.Item>
                      <Button type="primary" htmlType="submit" className="login-form-button">
                          登录
                      </Button>
                  </Form.Item>
              </Form>
          </div>
      </div>
  )
}
