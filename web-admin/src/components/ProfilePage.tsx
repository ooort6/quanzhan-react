import React, { useState } from 'react';
import { 
  Typography, 
  Card, 
  Form, 
  Input, 
  Button, 
  Avatar, 
  Upload, 
  Divider, 
  Row, 
  Col, 
  message, 
  Space,
  Badge
} from 'antd';
import { 
  UserOutlined, 
  MailOutlined, 
  PhoneOutlined, 
  EditOutlined, 
  UploadOutlined, 
  SaveOutlined,
  LockOutlined,
  SecurityScanOutlined
} from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';

const { Title, Paragraph, Text } = Typography;

const ProfilePage: React.FC = () => {
  const [form] = Form.useForm();
  const [editMode, setEditMode] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  // 模拟用户数据
  const userData = {
    username: '管理员',
    email: 'admin@example.com',
    phone: '13800138000',
    role: '管理员',
    createTime: '2025-03-22 12:00:00',
    lastLogin: '2025-03-24 08:30:00'
  };

  const handleSave = (values: any) => {
    console.log('保存的表单数据:', values);
    message.success('个人信息已更新');
    setEditMode(false);
  };

  const handleUploadChange = (info: any) => {
    if (info.file.status === 'done') {
      // 模拟上传成功后获取URL
      setAvatarUrl(URL.createObjectURL(info.file.originFileObj));
      message.success('头像上传成功');
    }
  };

  const passwordFormItems = (
    <Form layout="vertical">
      <Form.Item label="当前密码" name="currentPassword" rules={[{ required: true, message: '请输入当前密码' }]}>
        <Input.Password prefix={<LockOutlined />} placeholder="请输入当前密码" />
      </Form.Item>
      <Form.Item label="新密码" name="newPassword" rules={[{ required: true, message: '请输入新密码' }]}>
        <Input.Password prefix={<LockOutlined />} placeholder="请输入新密码" />
      </Form.Item>
      <Form.Item label="确认新密码" name="confirmPassword" rules={[
        { required: true, message: '请确认新密码' },
        ({ getFieldValue }) => ({
          validator(_, value) {
            if (!value || getFieldValue('newPassword') === value) {
              return Promise.resolve();
            }
            return Promise.reject(new Error('两次输入的密码不一致'));
          },
        }),
      ]}>
        <Input.Password prefix={<LockOutlined />} placeholder="请确认新密码" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" icon={<SaveOutlined />}>修改密码</Button>
      </Form.Item>
    </Form>
  );

  return (
    <div>
      <div style={{ 
        background: 'linear-gradient(120deg, #1890ff 0%, #69c0ff 100%)',
        borderRadius: '8px',
        padding: '24px',
        marginBottom: '24px',
        boxShadow: '0 4px 12px rgba(24,144,255,0.15)'
      }}>
        <Title level={2} style={{ color: 'white', margin: 0, marginBottom: '8px', textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
          个人信息
        </Title>
        <Paragraph style={{ color: 'rgba(255,255,255,0.85)', fontSize: '16px' }}>
          在这里您可以查看和修改您的个人信息以及账户安全设置
        </Paragraph>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={16}>
          <Card 
            title={
              <Space>
                <UserOutlined style={{ color: '#1890ff' }} />
                <span>基本信息</span>
              </Space>
            } 
            extra={
              !editMode ? (
                <Button type="primary" icon={<EditOutlined />} onClick={() => setEditMode(true)}>
                  编辑信息
                </Button>
              ) : null
            }
            style={{ 
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              height: '100%',
              borderTop: '3px solid #1890ff'
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '24px' }}>
              <Badge count={editMode ? <UploadOutlined style={{ color: '#fff' }} /> : 0} offset={[-5, 5]}>
                <Avatar 
                  size={100} 
                  icon={<UserOutlined />} 
                  src={avatarUrl}
                  style={{ 
                    background: avatarUrl ? 'transparent' : 'linear-gradient(120deg, #1890ff 0%, #69c0ff 100%)',
                    boxShadow: '0 2px 8px rgba(24,144,255,0.2)'
                  }} 
                />
              </Badge>
              {editMode && (
                <Upload 
                  maxCount={1}
                  showUploadList={false}
                  onChange={handleUploadChange}
                  beforeUpload={file => {
                    // 这里是为了演示，实际应该调用API上传
                    setFileList([file]);
                    return false;
                  }}
                  fileList={fileList}
                  style={{ marginTop: '10px' }}
                >
                  <Button icon={<UploadOutlined />} style={{ marginTop: '16px' }}>上传头像</Button>
                </Upload>
              )}
            </div>

            {!editMode ? (
              <div>
                <Row gutter={[16, 16]}>
                  <Col span={8} style={{ textAlign: 'right', color: '#8c8c8c' }}>用户名：</Col>
                  <Col span={16}>{userData.username}</Col>
                </Row>
                <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
                  <Col span={8} style={{ textAlign: 'right', color: '#8c8c8c' }}>邮箱：</Col>
                  <Col span={16}>{userData.email}</Col>
                </Row>
                <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
                  <Col span={8} style={{ textAlign: 'right', color: '#8c8c8c' }}>手机号：</Col>
                  <Col span={16}>{userData.phone}</Col>
                </Row>
                <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
                  <Col span={8} style={{ textAlign: 'right', color: '#8c8c8c' }}>角色：</Col>
                  <Col span={16}>{userData.role}</Col>
                </Row>
                <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
                  <Col span={8} style={{ textAlign: 'right', color: '#8c8c8c' }}>注册时间：</Col>
                  <Col span={16}>{userData.createTime}</Col>
                </Row>
                <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
                  <Col span={8} style={{ textAlign: 'right', color: '#8c8c8c' }}>上次登录：</Col>
                  <Col span={16}>{userData.lastLogin}</Col>
                </Row>
              </div>
            ) : (
              <Form
                form={form}
                layout="vertical"
                initialValues={userData}
                onFinish={handleSave}
              >
                <Form.Item name="username" label="用户名" rules={[{ required: true, message: '请输入用户名' }]}>
                  <Input prefix={<UserOutlined />} placeholder="请输入用户名" />
                </Form.Item>
                <Form.Item name="email" label="邮箱" rules={[
                  { required: true, message: '请输入邮箱' },
                  { type: 'email', message: '请输入有效的邮箱地址' }
                ]}>
                  <Input prefix={<MailOutlined />} placeholder="请输入邮箱" />
                </Form.Item>
                <Form.Item name="phone" label="手机号" rules={[{ required: true, message: '请输入手机号' }]}>
                  <Input prefix={<PhoneOutlined />} placeholder="请输入手机号" />
                </Form.Item>
                <Form.Item>
                  <Space>
                    <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                      保存
                    </Button>
                    <Button onClick={() => setEditMode(false)}>
                      取消
                    </Button>
                  </Space>
                </Form.Item>
              </Form>
            )}
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card 
            title={
              <Space>
                <SecurityScanOutlined style={{ color: '#1890ff' }} />
                <span>账户安全</span>
              </Space>
            } 
            style={{ 
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              borderTop: '3px solid #1890ff'
            }}
          >
            <Paragraph style={{ marginBottom: '16px' }}>
              <Text strong>密码强度：</Text> <Text type="success">强</Text>
            </Paragraph>
            <Paragraph style={{ marginBottom: '16px' }}>
              <Text strong>上次密码修改时间：</Text> 2025-03-01
            </Paragraph>
            
            <Divider>修改密码</Divider>
            {passwordFormItems}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ProfilePage; 