import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { Table, Button, Space, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Todo, todoService } from '../services/todoService';

const TodoList = forwardRef((_, ref) => {
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
      setTodos(response.data.records);
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
  }, []);

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
      message.success('更新成功');
      fetchTodos(pagination.current, pagination.pageSize);
    } catch (error) {
      message.error('更新失败');
    }
  };

  const columns: ColumnsType<Todo> = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '状态',
      dataIndex: 'completed',
      key: 'completed',
      render: (completed: boolean) => (
        <span>{completed ? '已完成' : '未完成'}</span>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type={record.completed ? 'default' : 'primary'}
            onClick={() => handleToggleComplete(record)}
          >
            {record.completed ? '标记未完成' : '标记完成'}
          </Button>
          <Button type="primary" danger onClick={() => handleDelete(record.id!)}>
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Table
        columns={columns}
        dataSource={todos}
        rowKey="id"
        pagination={{
          ...pagination,
          onChange: (page, pageSize) => fetchTodos(page, pageSize)
        }}
        loading={loading}
      />
    </div>
  );
});

export default TodoList; 