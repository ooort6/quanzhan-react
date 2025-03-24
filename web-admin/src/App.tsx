import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import MainLayout from './components/MainLayout';
import HomePage from './components/HomePage';
import TodosPage from './components/TodosPage';
import ProfilePage from './components/ProfilePage';
import CalendarPage from './components/CalendarPage';
import NotesPage from './components/NotesPage';
import CategoriesPage from './components/CategoriesPage';
import { useNavigate } from 'react-router-dom';

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

// 主应用布局包装
const MainLayoutWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ProtectedRoute>
      <MainLayout>
        {children}
      </MainLayout>
    </ProtectedRoute>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<Register />} />
        
        {/* 使用MainLayout的路由 */}
        <Route 
          path="/" 
          element={
            <MainLayoutWrapper>
              <HomePage />
            </MainLayoutWrapper>
          } 
        />
        <Route 
          path="/todos" 
          element={
            <MainLayoutWrapper>
              <TodosPage />
            </MainLayoutWrapper>
          } 
        />
        
        {/* 个人信息页面 */}
        <Route 
          path="/profile" 
          element={
            <MainLayoutWrapper>
              <ProfilePage />
            </MainLayoutWrapper>
          } 
        />
        
        {/* 日程安排页面 */}
        <Route 
          path="/calendar" 
          element={
            <MainLayoutWrapper>
              <CalendarPage />
            </MainLayoutWrapper>
          } 
        />
        
        {/* 笔记管理页面 */}
        <Route 
          path="/notes" 
          element={
            <MainLayoutWrapper>
              <NotesPage />
            </MainLayoutWrapper>
          } 
        />
        
        {/* 分类管理页面 */}
        <Route 
          path="/categories" 
          element={
            <MainLayoutWrapper>
              <CategoriesPage />
            </MainLayoutWrapper>
          } 
        />
        
        <Route 
          path="/settings" 
          element={
            <MainLayoutWrapper>
              <div>系统设置页面 - 待开发</div>
            </MainLayoutWrapper>
          } 
        />
        
        {/* 匹配任何未定义的路由，重定向到首页 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
