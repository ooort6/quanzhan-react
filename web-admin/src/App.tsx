import React, { useRef } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Typography, Card } from 'antd';
import TodoList from './components/TodoList';
import TodoForm from './components/TodoForm';
import Login from './components/Login';
import Register from './components/Register';

const { Header, Content } = Layout;
const { Title } = Typography;

// 受保护的路由，需要登录才能访问
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = localStorage.getItem('token');
  const location = useLocation();

  if (!token) {
    // 重定向到登录页面，并记录当前路径
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

// 主界面组件
const Dashboard: React.FC = () => {
  const todoListRef = useRef<any>(null);
  const navigate = useNavigate();

  const handleTodoCreated = () => {
    todoListRef.current?.fetchTodos();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ background: '#fff', padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={3} style={{ margin: '16px 0' }}>待办事项管理系统</Title>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            handleLogout();
          }}
        >
          退出登录
        </a>
      </Header>
      <Content style={{ padding: '20px' }}>
        <Card title="新增待办事项" style={{ marginBottom: '20px' }}>
          <TodoForm onSuccess={handleTodoCreated} />
        </Card>
        <Card title="待办事项列表">
          <TodoList ref={todoListRef} />
        </Card>
      </Content>
    </Layout>
  );
};

// 登录成功后的处理函数
const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || '/';

  const handleLoginSuccess = () => {
    navigate(from, { replace: true });
  };

  return <Login onLoginSuccess={handleLoginSuccess} />;
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<Register />} />
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
