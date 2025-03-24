import React, { useState } from 'react';
import { Layout, Menu, Breadcrumb, Typography, Avatar, Dropdown, theme, ConfigProvider } from 'antd';
import type { MenuProps } from 'antd';
import { 
  MenuFoldOutlined, 
  MenuUnfoldOutlined, 
  UserOutlined, 
  CheckSquareOutlined, 
  HomeOutlined, 
  SettingOutlined, 
  LogoutOutlined,
  CalendarOutlined,
  FileTextOutlined,
  BarsOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

interface MainLayoutProps {
  children: React.ReactNode;
}

// 自定义主题颜色
const customTheme = {
  token: {
    colorPrimary: '#1890ff',
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#f5222d',
    colorInfo: '#1890ff',
    borderRadius: 6,
  },
};

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = theme.useToken();

  // 获取路径，生成面包屑
  const pathSnippets = location.pathname.split('/').filter(i => i);
  const breadcrumbNameMap: Record<string, string> = {
    '/': '首页',
    '/todos': '待办事项',
    '/profile': '个人信息',
    '/settings': '系统设置',
    '/calendar': '日程安排',
    '/notes': '笔记管理',
    '/categories': '分类管理'
  };

  const extraBreadcrumbItems = pathSnippets.map((_, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
    return (
      <Breadcrumb.Item key={url}>
        {breadcrumbNameMap[url] || url.split('/').pop()}
      </Breadcrumb.Item>
    );
  });

  const breadcrumbItems = [
    <Breadcrumb.Item key="home">
      <span onClick={() => navigate('/')} style={{ cursor: 'pointer' }}><HomeOutlined /> 首页</span>
    </Breadcrumb.Item>,
  ].concat(extraBreadcrumbItems);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // 修复用户菜单项格式
  const userMenuItems: MenuProps['items'] = [
    {
      key: '1',
      icon: <UserOutlined />,
      label: '个人信息',
      onClick: () => navigate('/profile')
    },
    {
      key: '2',
      icon: <SettingOutlined />,
      label: '系统设置',
      onClick: () => navigate('/settings')
    },
    {
      key: 'divider',
      type: 'divider'
    },
    {
      key: '3',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: handleLogout
    },
  ];

  // 获取当前活动菜单项
  const getActiveMenuKey = () => {
    if (location.pathname === '/') return '1';
    if (location.pathname.startsWith('/todos')) return '2';
    if (location.pathname.startsWith('/calendar')) return '3';
    if (location.pathname.startsWith('/notes')) return '4';
    if (location.pathname.startsWith('/categories')) return '5';
    if (location.pathname.startsWith('/profile')) return '6';
    if (location.pathname.startsWith('/settings')) return '7';
    return '1';
  };

  return (
    <ConfigProvider theme={customTheme}>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider 
          trigger={null} 
          collapsible 
          collapsed={collapsed} 
          theme="light"
          style={{
            overflow: 'auto',
            height: '100vh',
            position: 'fixed',
            left: 0,
            top: 0,
            bottom: 0,
            boxShadow: '2px 0 8px 0 rgba(29,35,41,.1)',
            background: 'linear-gradient(180deg, #f0f2f5 0%, #ffffff 100%)',
            borderRight: '1px solid #f0f2f5',
            zIndex: 10
          }}
        >
          <div style={{ 
            height: 64, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            margin: '16px 0',
            background: 'linear-gradient(135deg, #1890ff 0%, #69c0ff 100%)',
            borderRadius: '0 0 8px 8px',
            boxShadow: '0 2px 8px rgba(24, 144, 255, 0.2)',
            padding: '0 16px'
          }}>
            <Title level={4} style={{ color: '#fff', margin: 0, textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
              {collapsed ? 'TODO' : '待办事项系统'}
            </Title>
          </div>
          <Menu
            theme="light"
            mode="inline"
            defaultSelectedKeys={[getActiveMenuKey()]}
            style={{ 
              borderRight: 'none',
              background: 'transparent',
              marginTop: 16 
            }}
            items={[
              {
                key: '1',
                icon: <HomeOutlined style={{ fontSize: '16px' }} />,
                label: <Text strong={location.pathname === '/'}>首页</Text>,
                onClick: () => navigate('/')
              },
              {
                key: '2',
                icon: <CheckSquareOutlined style={{ fontSize: '16px' }} />,
                label: <Text strong={location.pathname.startsWith('/todos')}>待办事项</Text>,
                onClick: () => navigate('/todos')
              },
              {
                key: '3',
                icon: <CalendarOutlined style={{ fontSize: '16px' }} />,
                label: <Text strong={location.pathname.startsWith('/calendar')}>日程安排</Text>,
                onClick: () => navigate('/calendar')
              },
              {
                key: '4',
                icon: <FileTextOutlined style={{ fontSize: '16px' }} />,
                label: <Text strong={location.pathname.startsWith('/notes')}>笔记</Text>,
                onClick: () => navigate('/notes')
              },
              {
                key: '5',
                icon: <BarsOutlined style={{ fontSize: '16px' }} />,
                label: <Text strong={location.pathname.startsWith('/categories')}>分类管理</Text>,
                onClick: () => navigate('/categories')
              },
            ]}
          />
        </Sider>
        <Layout style={{ marginLeft: collapsed ? 80 : 200, transition: 'all 0.2s' }}>
          <Header style={{ 
            padding: '0 16px', 
            background: '#fff', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            zIndex: 9,
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            borderBottom: '1px solid #f0f2f5'
          }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                className: 'trigger',
                onClick: () => setCollapsed(!collapsed),
                style: { fontSize: '18px', color: token.colorPrimary }
              })}
              <div style={{ marginLeft: 24, fontSize: 16, fontWeight: 500, color: '#262626' }}>
                {breadcrumbNameMap[location.pathname] || '待办事项管理系统'}
              </div>
            </div>
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                <Avatar 
                  icon={<UserOutlined />} 
                  style={{ 
                    background: 'linear-gradient(120deg, #1890ff 0%, #69c0ff 100%)',
                    boxShadow: '0 2px 4px rgba(24,144,255,0.2)'
                  }} 
                />
                <span style={{ marginLeft: 8, fontWeight: 500 }}>管理员</span>
              </div>
            </Dropdown>
          </Header>
          <Content style={{ 
            margin: '16px', 
            padding: 24, 
            minHeight: 280, 
            background: '#fff',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
          }}>
            <Breadcrumb style={{ marginBottom: '16px' }}>
              {breadcrumbItems}
            </Breadcrumb>
            <div style={{ padding: '8px 0' }}>
              {children}
            </div>
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default MainLayout; 