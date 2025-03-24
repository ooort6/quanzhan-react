import React, { useRef } from 'react';
import { Card, Typography, Row, Col, Tabs, Tag, Space, Alert } from 'antd';
import { 
  PlusOutlined, 
  CheckCircleOutlined, 
  ClockCircleOutlined, 
  UnorderedListOutlined 
} from '@ant-design/icons';
import TodoList from './TodoList';
import TodoForm from './TodoForm';

const { Title, Paragraph } = Typography;
const { TabPane } = Tabs;

const TodosPage: React.FC = () => {
  const todoListRef = useRef<any>(null);

  const handleTodoCreated = () => {
    todoListRef.current?.fetchTodos();
  };

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <Title level={2} style={{ marginBottom: '8px' }}>待办事项管理</Title>
        <Paragraph type="secondary">
          在这里您可以创建、编辑和管理您的所有待办事项
        </Paragraph>
        <Space style={{ marginTop: '8px' }}>
          <Tag color="processing" icon={<ClockCircleOutlined />}>待处理</Tag>
          <Tag color="success" icon={<CheckCircleOutlined />}>已完成</Tag>
          <Tag color="default" icon={<UnorderedListOutlined />}>全部</Tag>
        </Space>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={10} lg={8}>
          <Card 
            title={
              <Space>
                <PlusOutlined style={{ color: '#1890ff' }} />
                <span>新增待办事项</span>
              </Space>
            } 
            style={{ 
              marginBottom: '20px', 
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              height: '100%',
              borderTop: '3px solid #1890ff'
            }}
            bodyStyle={{ padding: '24px' }}
          >
            <Alert
              message="添加新的待办事项"
              description="在这里添加您需要完成的新任务，填写任务标题和描述，然后点击创建按钮。"
              type="info"
              showIcon
              style={{ marginBottom: '16px' }}
            />
            <TodoForm onSuccess={handleTodoCreated} />
          </Card>
        </Col>
        <Col xs={24} md={14} lg={16}>
          <Card 
            title={
              <Space>
                <UnorderedListOutlined style={{ color: '#1890ff' }} />
                <span>待办事项列表</span>
              </Space>
            } 
            style={{ 
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              borderTop: '3px solid #1890ff'
            }}
            bodyStyle={{ padding: '4px 24px 24px' }}
            extra={
              <Space>
                <Tag color="processing">{5} 待处理</Tag>
                <Tag color="success">{3} 已完成</Tag>
              </Space>
            }
          >
            <Tabs defaultActiveKey="all">
              <TabPane tab="全部" key="all">
                <TodoList ref={todoListRef} />
              </TabPane>
              <TabPane tab="待处理" key="todo">
                <TodoList ref={todoListRef} filterCompleted={false} />
              </TabPane>
              <TabPane tab="已完成" key="completed">
                <TodoList ref={todoListRef} filterCompleted={true} />
              </TabPane>
            </Tabs>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default TodosPage; 