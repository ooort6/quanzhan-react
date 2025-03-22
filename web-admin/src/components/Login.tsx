import React, { useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { Link } from 'react-router-dom';
import axios from 'axios';

interface LoginProps {
  onLoginSuccess: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleLogin = async (values: { username: string; password: string }) => {
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:8080/api/auth/login', values);
      if (response.data && response.data.data && response.data.data.token) {
        localStorage.setItem('token', response.data.data.token);
        message.success('登录成功');
        onLoginSuccess();
      } else {
        message.error('登录失败：没有收到有效的token');
      }
    } catch (error) {
      console.error('登录错误', error);
      message.error('登录失败，请检查用户名和密码');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="用户登录" style={{ maxWidth: 400, margin: '100px auto' }}>
      <Form
        form={form}
        name="login"
        onFinish={handleLogin}
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

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} style={{ marginRight: 10 }}>
            登录
          </Button>
          <span>
            还没有账号？ <Link to="/register">立即注册</Link>
          </span>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default Login; 