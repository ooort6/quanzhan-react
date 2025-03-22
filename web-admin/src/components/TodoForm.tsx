import React from 'react';
import { Form, Input, Button, message } from 'antd';
import { todoService } from '../services/todoService';

interface TodoFormProps {
  onSuccess?: () => void;
}

const TodoForm: React.FC<TodoFormProps> = ({ onSuccess }) => {
  const [form] = Form.useForm();

  const handleSubmit = async (values: { title: string; description: string }) => {
    try {
      await todoService.createTodo({
        ...values,
        completed: false
      });
      message.success('创建成功');
      form.resetFields();
      onSuccess?.();
    } catch (error) {
      message.error('创建失败');
    }
  };

  return (
    <Form form={form} onFinish={handleSubmit} layout="vertical">
      <Form.Item
        label="标题"
        name="title"
        rules={[{ required: true, message: '请输入待办事项标题' }]}
      >
        <Input placeholder="请输入待办事项标题" />
      </Form.Item>

      <Form.Item
        label="描述"
        name="description"
        rules={[{ required: true, message: '请输入待办事项描述' }]}
      >
        <Input.TextArea placeholder="请输入待办事项描述" rows={4} />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          创建待办事项
        </Button>
      </Form.Item>
    </Form>
  );
};

export default TodoForm; 