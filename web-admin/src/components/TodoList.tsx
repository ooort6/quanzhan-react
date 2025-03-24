import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { Table, Button, Space, message, Tag, Badge, Typography, Empty } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { CheckCircleOutlined, ClockCircleOutlined, DeleteOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Todo, todoService } from '../services/todoService';

const { Text } = Typography;

interface TodoListProps {
  filterCompleted?: boolean | null;
}

const TodoList = forwardRef(({ filterCompleted = null }: TodoListProps, ref) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });

  const fetchTodos = async (page: number = 1, size: number = 10) => {
    try {
      setLoading(true);
      const response = await todoService.getTodoList(page, size);
      let filteredTodos = response.data.records;
      
      // 根据完成状态过滤任务
      if (filterCompleted !== null) {
        filteredTodos = filteredTodos.filter(todo => todo.completed === filterCompleted);
      }
      
      setTodos(filteredTodos);
      setPagination({
        current: response.data.current,
        pageSize: response.data.size,
        total: response.data.total
      });
    } catch (error) {
      message.error('获取待办事项列表失败');
    } finally {
      setLoading(false);
    }
  };

  useImperativeHandle(ref, () => ({
    fetchTodos
  }));

  useEffect(() => {
    fetchTodos();
  }, [filterCompleted]);

  const handleDelete = async (id: number) => {
    try {
      await todoService.deleteTodo(id);
      message.success('删除成功');
      fetchTodos(pagination.current, pagination.pageSize);
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleToggleComplete = async (todo: Todo) => {
    try {
      await todoService.updateTodo(todo.id!, { completed: !todo.completed });
      message.success(todo.completed ? '已标记为未完成' : '已标记为完成');
      fetchTodos(pagination.current, pagination.pageSize);
    } catch (error) {
      message.error('更新失败');
    }
  };

  const columns: ColumnsType<Todo> = [
    {
      title: '状态',
      dataIndex: 'completed',
      key: 'completed',
      width: 80,
      align: 'center',
      render: (completed: boolean) => (
        completed ? 
          <Badge status="success" text={<Tag icon={<CheckCircleOutlined />} color="success">已完成</Tag>} /> : 
          <Badge status="processing" text={<Tag icon={<ClockCircleOutlined />} color="processing">待处理</Tag>} />
      ),
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      render: (text: string, record: Todo) => (
        <Text 
          style={{ 
            textDecoration: record.completed ? 'line-through' : 'none',
            color: record.completed ? '#8c8c8c' : 'inherit',
            fontWeight: 500
          }}
        >
          {text}
        </Text>
      )
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      render: (text: string, record: Todo) => (
        <Text 
          style={{ 
            color: record.completed ? '#8c8c8c' : 'inherit',
            textDecoration: record.completed ? 'line-through' : 'none',
          }}
        >
          {text}
        </Text>
      )
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 180,
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <Space size="middle">
          <Button
            type={record.completed ? 'default' : 'primary'}
            icon={record.completed ? <CloseOutlined /> : <CheckOutlined />}
            size="small"
            onClick={() => handleToggleComplete(record)}
          >
            {record.completed ? '标记未完成' : '标记完成'}
          </Button>
          <Button 
            type="primary" 
            danger 
            icon={<DeleteOutlined />}
            size="small"
            onClick={() => handleDelete(record.id!)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  const locale = {
    emptyText: (
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description={
          <span>
            暂无{filterCompleted === true ? '已完成' : filterCompleted === false ? '待处理' : ''}待办事项
          </span>
        }
      />
    )
  };

  return (
    <div>
      <Table
        columns={columns}
        dataSource={todos}
        rowKey="id"
        pagination={{
          ...pagination,
          onChange: (page, pageSize) => fetchTodos(page, pageSize),
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 项`,
        }}
        loading={loading}
        locale={locale}
        rowClassName={(record) => record.completed ? 'completed-row' : ''}
        size="middle"
        bordered={false}
      />
    </div>
  );
});

export default TodoList; 