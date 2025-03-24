import React, { useState } from 'react';
import {
  Typography,
  Card,
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Tag,
  message,
  Tooltip,
  Row,
  Col,
  Statistic,
  Popconfirm,
  Divider,
  ColorPicker
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  AppstoreOutlined,
  FileTextOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import type { Color } from 'antd/es/color-picker';

const { Title, Paragraph, Text } = Typography;

// 定义分类类型
interface Category {
  id: number;
  name: string;
  description: string;
  color: string;
  type: 'todo' | 'note' | 'calendar';
  count: number; // 该分类下的项目数量
  createdAt: string;
}

// 定义状态统计类型
interface Stats {
  total: number;
  todoCategories: number;
  noteCategories: number;
  calendarCategories: number;
}

const CategoriesPage: React.FC = () => {
  // 示例数据
  const initialCategories: Category[] = [
    {
      id: 1,
      name: '工作',
      description: '与工作相关的任务和笔记',
      color: '#1890ff',
      type: 'todo',
      count: 15,
      createdAt: '2025-03-10 09:30:00'
    },
    {
      id: 2,
      name: '个人',
      description: '个人事务和安排',
      color: '#52c41a',
      type: 'todo',
      count: 8,
      createdAt: '2025-03-10 10:15:00'
    },
    {
      id: 3,
      name: '紧急',
      description: '需要紧急处理的任务',
      color: '#f5222d',
      type: 'todo',
      count: 3,
      createdAt: '2025-03-11 14:20:00'
    },
    {
      id: 4,
      name: '学习',
      description: '学习相关笔记和资料',
      color: '#faad14',
      type: 'note',
      count: 12,
      createdAt: '2025-03-12 08:45:00'
    },
    {
      id: 5,
      name: '项目',
      description: '项目相关的笔记和文档',
      color: '#13c2c2',
      type: 'note',
      count: 7,
      createdAt: '2025-03-13 16:30:00'
    },
    {
      id: 6,
      name: '会议',
      description: '各类会议安排',
      color: '#722ed1',
      type: 'calendar',
      count: 5,
      createdAt: '2025-03-14 11:20:00'
    },
    {
      id: 7,
      name: '假期',
      description: '休假和节假日安排',
      color: '#eb2f96',
      type: 'calendar',
      count: 3,
      createdAt: '2025-03-15 15:10:00'
    }
  ];

  // 状态定义
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [form] = Form.useForm();
  const [filterType, setFilterType] = useState<string>('all');

  // 统计数据
  const stats: Stats = {
    total: categories.length,
    todoCategories: categories.filter(c => c.type === 'todo').length,
    noteCategories: categories.filter(c => c.type === 'note').length,
    calendarCategories: categories.filter(c => c.type === 'calendar').length
  };

  // 编辑或添加分类的模态框
  const showModal = (category: Category | null) => {
    setCurrentCategory(category);
    setModalVisible(true);
    
    if (category) {
      form.setFieldsValue({
        name: category.name,
        description: category.description,
        color: category.color,
        type: category.type
      });
    } else {
      form.resetFields();
    }
  };

  // 保存分类
  const handleSave = (values: any) => {
    const { name, description, color, type } = values;
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const hexColor = typeof color === 'string' ? color : color.toHexString();
    
    if (currentCategory) {
      // 更新分类
      const updatedCategories = categories.map(category => 
        category.id === currentCategory.id 
          ? { 
              ...category, 
              name, 
              description, 
              color: hexColor, 
              type
            } 
          : category
      );
      setCategories(updatedCategories);
      message.success('分类已更新');
    } else {
      // 添加新分类
      const newCategory: Category = {
        id: Date.now(),
        name,
        description,
        color: hexColor,
        type,
        count: 0,
        createdAt: now
      };
      setCategories([...categories, newCategory]);
      message.success('分类已创建');
    }
    
    setModalVisible(false);
  };

  // 删除分类
  const handleDelete = (id: number) => {
    setCategories(categories.filter(category => category.id !== id));
    message.success('分类已删除');
  };

  // 获取过滤后的分类
  const getFilteredCategories = () => {
    if (filterType === 'all') {
      return categories;
    }
    return categories.filter(category => category.type === filterType);
  };

  // 获取类型对应的图标
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'todo':
        return <CheckCircleOutlined style={{ color: '#1890ff' }} />;
      case 'note':
        return <FileTextOutlined style={{ color: '#52c41a' }} />;
      case 'calendar':
        return <CalendarOutlined style={{ color: '#722ed1' }} />;
      default:
        return <AppstoreOutlined />;
    }
  };

  // 获取类型对应的名称
  const getTypeName = (type: string) => {
    switch (type) {
      case 'todo':
        return '待办事项';
      case 'note':
        return '笔记';
      case 'calendar':
        return '日程';
      default:
        return type;
    }
  };

  // 表格列配置
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80
    },
    {
      title: '分类名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Category) => (
        <Space>
          <Tag color={record.color} style={{ width: '12px', height: '12px', display: 'inline-block', marginRight: '8px' }} />
          <Text strong>{text}</Text>
        </Space>
      )
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 150,
      render: (text: string) => (
        <Space>
          {getTypeIcon(text)}
          {getTypeName(text)}
        </Space>
      )
    },
    {
      title: '颜色',
      dataIndex: 'color',
      key: 'color',
      width: 100,
      render: (color: string) => (
        <Tag color={color} style={{ width: '50px', height: '22px' }} />
      )
    },
    {
      title: '项目数量',
      dataIndex: 'count',
      key: 'count',
      width: 120,
      sorter: (a: Category, b: Category) => a.count - b.count
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_: any, record: Category) => (
        <Space>
          <Tooltip title="编辑分类">
            <Button 
              type="text" 
              icon={<EditOutlined />} 
              onClick={() => showModal(record)}
            />
          </Tooltip>
          <Popconfirm
            title="确定要删除此分类吗？"
            description="删除后无法恢复，该分类下的项目将变为未分类状态。"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
            icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
          >
            <Button 
              type="text" 
              icon={<DeleteOutlined />} 
              danger
            />
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div>
      <div style={{ 
        background: 'linear-gradient(120deg, #fa541c 0%, #ffd666 100%)',
        borderRadius: '8px',
        padding: '24px',
        marginBottom: '24px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
      }}>
        <Title level={2} style={{ color: 'white', margin: 0, marginBottom: '8px', textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
          分类管理
        </Title>
        <Paragraph style={{ color: 'rgba(255,255,255,0.85)', fontSize: '16px' }}>
          在这里您可以管理待办事项、笔记和日程的所有分类
        </Paragraph>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={6}>
          <Card style={{ 
            borderRadius: '8px', 
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            background: 'linear-gradient(135deg, #fafafa 0%, #f0f2f5 100%)',
            borderTop: '3px solid #fa541c'
          }}>
            <Statistic 
              title="总分类数" 
              value={stats.total} 
              prefix={<AppstoreOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card style={{ 
            borderRadius: '8px', 
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            background: 'linear-gradient(135deg, #fafafa 0%, #f0f2f5 100%)',
            borderTop: '3px solid #1890ff'
          }}>
            <Statistic 
              title="待办事项分类" 
              value={stats.todoCategories} 
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card style={{ 
            borderRadius: '8px', 
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            background: 'linear-gradient(135deg, #fafafa 0%, #f0f2f5 100%)',
            borderTop: '3px solid #52c41a'
          }}>
            <Statistic 
              title="笔记分类" 
              value={stats.noteCategories} 
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card style={{ 
            borderRadius: '8px', 
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            background: 'linear-gradient(135deg, #fafafa 0%, #f0f2f5 100%)',
            borderTop: '3px solid #722ed1'
          }}>
            <Statistic 
              title="日程分类" 
              value={stats.calendarCategories} 
              prefix={<CalendarOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      <Card 
        title={
          <Space>
            <AppstoreOutlined style={{ color: '#fa541c' }} />
            <span>分类列表</span>
          </Space>
        }
        extra={
          <Space>
            <div>
              <Space>
                <Button 
                  type={filterType === 'all' ? 'primary' : 'default'} 
                  onClick={() => setFilterType('all')}
                >
                  全部
                </Button>
                <Button 
                  type={filterType === 'todo' ? 'primary' : 'default'} 
                  onClick={() => setFilterType('todo')}
                  icon={<CheckCircleOutlined />}
                >
                  待办事项
                </Button>
                <Button 
                  type={filterType === 'note' ? 'primary' : 'default'} 
                  onClick={() => setFilterType('note')}
                  icon={<FileTextOutlined />}
                >
                  笔记
                </Button>
                <Button 
                  type={filterType === 'calendar' ? 'primary' : 'default'} 
                  onClick={() => setFilterType('calendar')}
                  icon={<CalendarOutlined />}
                >
                  日程
                </Button>
              </Space>
            </div>
            <Divider type="vertical" />
            <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal(null)}>
              添加分类
            </Button>
          </Space>
        }
        style={{ 
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          marginTop: '16px',
          borderTop: '3px solid #fa541c'
        }}
      >
        <Table 
          columns={columns} 
          dataSource={getFilteredCategories()} 
          rowKey="id"
          pagination={{
            defaultPageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 项`
          }}
        />
      </Card>

      {/* 添加/编辑分类模态框 */}
      <Modal
        title={currentCategory ? "编辑分类" : "添加分类"}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
          initialValues={{
            type: 'todo',
            color: '#1890ff'
          }}
        >
          <Form.Item
            name="name"
            label="分类名称"
            rules={[{ required: true, message: '请输入分类名称' }]}
          >
            <Input placeholder="请输入分类名称" />
          </Form.Item>
          <Form.Item
            name="description"
            label="分类描述"
          >
            <Input.TextArea rows={3} placeholder="请输入分类描述" />
          </Form.Item>
          <Form.Item
            name="type"
            label="分类类型"
            rules={[{ required: true, message: '请选择分类类型' }]}
          >
            <Space direction="vertical" style={{ width: '100%' }}>
              <Button.Group style={{ width: '100%' }}>
                <Button 
                  type={form.getFieldValue('type') === 'todo' ? 'primary' : 'default'} 
                  icon={<CheckCircleOutlined />} 
                  onClick={() => form.setFieldsValue({ type: 'todo' })}
                  style={{ width: '33.33%' }}
                >
                  待办事项
                </Button>
                <Button 
                  type={form.getFieldValue('type') === 'note' ? 'primary' : 'default'} 
                  icon={<FileTextOutlined />} 
                  onClick={() => form.setFieldsValue({ type: 'note' })}
                  style={{ width: '33.33%' }}
                >
                  笔记
                </Button>
                <Button 
                  type={form.getFieldValue('type') === 'calendar' ? 'primary' : 'default'} 
                  icon={<CalendarOutlined />} 
                  onClick={() => form.setFieldsValue({ type: 'calendar' })}
                  style={{ width: '33.33%' }}
                >
                  日程
                </Button>
              </Button.Group>
              <Input hidden name="type" />
            </Space>
          </Form.Item>
          <Form.Item
            name="color"
            label="分类颜色"
            rules={[{ required: true, message: '请选择分类颜色' }]}
          >
            <ColorPicker />
          </Form.Item>
          <Form.Item>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button style={{ marginRight: 8 }} onClick={() => setModalVisible(false)}>
                取消
              </Button>
              <Button type="primary" htmlType="submit">
                保存
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CategoriesPage; 