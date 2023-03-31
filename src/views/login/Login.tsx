import React from 'react'
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Button, Form, Input, message } from 'antd';
import { useNavigate } from 'react-router-dom'

import './login.css'
import { getData } from '../../api';


const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 19 },
};

const tailLayout = {
  wrapperCol: { offset: 5, span: 15 },
};

export default function Login() {

  const [messageApi, contextHolder] = message.useMessage();

  const [form] = Form.useForm();
  const navigate = useNavigate()

  const login = async (values: any) => {
    console.log(values);
    const res = await getData(`users?username=${values.username}&password=${values.password}&roleState=true&_expand=role`)
    console.log('res', res.data)
    if (res.data.length > 0) {
      localStorage.setItem('token', JSON.stringify(res.data[0]))
      messageApi.open({
        type: 'success',
        content: '登录成功！',
      });
      return navigate('/')
    }
    messageApi.open({
      type: 'error',
      content: '账号或者密码出错！',
    });
  };

  const onReset = () => {
    form.resetFields();
  };

  return (
    <div style={{ background: 'rgb(35,39,65)', height: '100%' }}>
      {contextHolder}
      <div className="formContainer">
        <h2>新闻发布系统</h2>
        <div className="form">
          <Form
            form={form}
            {...layout}
            name="form"
            onFinish={login}
          >
            <Form.Item name="username" label="用户名"
              rules={[{ required: true, message: '请输入用户名！' }]}>
              <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="请输入用户名" />
            </Form.Item>
            <Form.Item
              label="密码"
              name="password"
              rules={[{ required: true, message: '请输入密码！' }]}
            >
              <Input.Password prefix={<LockOutlined className="site-form-item-icon" />} placeholder="请输入密码" />
            </Form.Item>
            <Form.Item {...tailLayout}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                <Button type="primary" htmlType="submit">
                  登录
                </Button>
                <Button htmlType="button" onClick={onReset}>
                  重置
                </Button>
              </div>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  )
}
