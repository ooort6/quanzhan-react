import React, { useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handleRegister = async (values: { 
    username: string; 
    password: string; 
    confirmPassword: string;
    nickname?: string;
    email?: string;
  }) => {
    try {
      if (values.password !== values.confirmPassword) {
        message.error('两次输入的密码不一致');
        return;
      }
      
      setLoading(true);
      await axios.post('http://localhost:8080/api/auth/register', {
        username: values.username,
        password: values.password,
        nickname: values.nickname || values.username,
        email: values.email || `${values.username}@example.com`
      });
      
      message.success('注册成功，请登录');
      navigate('/login');
    } catch (error) {
      console.error('注册错误', error);
      message.error('注册失败，请稍后再试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="用户注册" style={{ maxWidth: 400, margin: '100px auto' }}>
      <Form
        form={form}
        name="register"
        onFinish={handleRegister}
        layout="vertical"
      >
        <Form.Item
          label="用户名"
          name="username"
          rules={[{ required: true, message: '请输入用户名' }]}
        >
          <Input placeholder="请输入用户名" />
        </Form.Item>

        <Form.Item
          label="密码"
          name="password"
          rules={[{ required: true, message: '请输入密码' }]}
        >
          <Input.Password placeholder="请输入密码" />
        </Form.Item>

        <Form.Item
          label="确认密码"
          name="confirmPassword"
          rules={[{ required: true, message: '请再次输入密码' }]}
        >
          <Input.Password placeholder="请再次输入密码" />
        </Form.Item>

        <Form.Item
          label="昵称"
          name="nickname"
        >
          <Input placeholder="请输入昵称（可选）" />
        </Form.Item>

        <Form.Item
          label="邮箱"
          name="email"
          rules={[{ type: 'email', message: '请输入有效的邮箱地址' }]}
        >
          <Input placeholder="请输入邮箱（可选）" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} style={{ marginRight: 10 }}>
            注册
          </Button>
          <span>
            已有账号？ <Link to="/login">返回登录</Link>
          </span>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default Register; 