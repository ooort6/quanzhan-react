import React, { useState, useEffect } from 'react';
import { Typography, Card, Input, Button, List, Tag, Space, Row, Col, Dropdown, Modal, Form, Select, Empty, message, Tooltip, Divider } from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  ExclamationCircleOutlined, 
  SearchOutlined,
  MoreOutlined,
  FileTextOutlined,
  TagOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
  StarOutlined,
  StarFilled
} from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const { confirm } = Modal;

// 定义笔记类型
interface Note {
  id: number;
  title: string;
  content: string;
  category: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  favorite: boolean;
}

// 定义分类类型
interface Category {
  id: number;
  name: string;
  color: string;
}

const NotesPage: React.FC = () => {
  // 示例数据
  const initialCategories: Category[] = [
    { id: 1, name: '工作', color: '#1890ff' },
    { id: 2, name: '个人', color: '#52c41a' },
    { id: 3, name: '学习', color: '#faad14' },
    { id: 4, name: '项目', color: '#f5222d' },
  ];

  const initialNotes: Note[] = [
    { 
      id: 1, 
      title: 'React Hooks 使用笔记', 
      content: '# React Hooks\n\n## useState\n\n```jsx\nconst [state, setState] = useState(initialState);\n```\n\n用于管理组件的状态\n\n## useEffect\n\n```jsx\nuseEffect(() => {\n  // 副作用代码\n  return () => {\n    // 清理函数\n  };\n}, [dependencies]);\n```\n\n用于处理副作用', 
      category: '学习', 
      tags: ['React', '前端', 'Hooks'], 
      createdAt: '2025-03-15 10:30:00',
      updatedAt: '2025-03-15 10:30:00',
      favorite: true
    },
    { 
      id: 2, 
      title: '项目进度记录', 
      content: '# 项目进度\n\n## 已完成功能\n\n- 用户登录\n- 基础布局\n- To-Do 功能\n\n## 待完成功能\n\n- 日历功能\n- 笔记功能\n- 个人信息管理', 
      category: '工作', 
      tags: ['项目', '进度'], 
      createdAt: '2025-03-16 14:20:00',
      updatedAt: '2025-03-16 16:45:00',
      favorite: false
    },
    { 
      id: 3, 
      title: '每周健身计划', 
      content: '# 健身计划\n\n## 周一\n- 胸肌训练 30分钟\n- 有氧运动 20分钟\n\n## 周三\n- 背部训练 30分钟\n- 腹肌训练 15分钟\n\n## 周五\n- 腿部训练 30分钟\n- 有氧运动 20分钟', 
      category: '个人', 
      tags: ['健身', '计划'], 
      createdAt: '2025-03-17 09:15:00',
      updatedAt: '2025-03-17 09:15:00',
      favorite: true
    },
    { 
      id: 4, 
      title: '产品需求分析', 
      content: '# 需求分析\n\n## 用户痛点\n\n1. 任务管理不便\n2. 日程安排混乱\n3. 笔记分散管理\n\n## 解决方案\n\n提供一站式任务、日程、笔记管理平台', 
      category: '项目', 
      tags: ['需求', '分析'], 
      createdAt: '2025-03-18 11:30:00',
      updatedAt: '2025-03-19 14:10:00',
      favorite: false
    },
  ];

  // 状态定义
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [editNoteVisible, setEditNoteVisible] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchText, setSearchText] = useState('');
  const [form] = Form.useForm();
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  
  // 添加或编辑笔记
  const showEditModal = (note: Note | null) => {
    setCurrentNote(note);
    setEditNoteVisible(true);
    if (note) {
      form.setFieldsValue({
        title: note.title,
        content: note.content,
        category: note.category,
        tags: note.tags,
      });
    } else {
      form.resetFields();
    }
  };

  // 保存笔记
  const handleSave = (values: any) => {
    const { title, content, category, tags } = values;
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
    
    if (currentNote) {
      // 更新笔记
      const updatedNotes = notes.map(note => 
        note.id === currentNote.id 
          ? { 
              ...note, 
              title, 
              content, 
              category, 
              tags, 
              updatedAt: now 
            } 
          : note
      );
      setNotes(updatedNotes);
      message.success('笔记已更新');
    } else {
      // 添加新笔记
      const newNote: Note = {
        id: Date.now(),
        title,
        content,
        category,
        tags,
        createdAt: now,
        updatedAt: now,
        favorite: false
      };
      setNotes([newNote, ...notes]);
      message.success('笔记已创建');
    }
    
    setEditNoteVisible(false);
  };

  // 删除笔记
  const handleDelete = (note: Note) => {
    confirm({
      title: '确认删除',
      icon: <ExclamationCircleOutlined />,
      content: `确定要删除笔记 "${note.title}" 吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk() {
        setNotes(notes.filter(item => item.id !== note.id));
        message.success('笔记已删除');
      },
    });
  };

  // 预览笔记
  const handlePreview = (note: Note) => {
    setCurrentNote(note);
    setPreviewVisible(true);
  };

  // 收藏/取消收藏笔记
  const toggleFavorite = (noteId: number) => {
    setNotes(notes.map(note => 
      note.id === noteId ? { ...note, favorite: !note.favorite } : note
    ));
  };

  // 过滤笔记
  const getFilteredNotes = () => {
    return notes
      .filter(note => selectedCategory === 'all' || note.category === selectedCategory)
      .filter(note => !showOnlyFavorites || note.favorite)
      .filter(note => selectedTags.length === 0 || selectedTags.some(tag => note.tags.includes(tag)))
      .filter(note => 
        note.title.toLowerCase().includes(searchText.toLowerCase()) || 
        note.content.toLowerCase().includes(searchText.toLowerCase()) ||
        note.tags.some(tag => tag.toLowerCase().includes(searchText.toLowerCase()))
      )
      .sort((a, b) => {
        const dateA = new Date(a.updatedAt);
        const dateB = new Date(b.updatedAt);
        return sortOrder === 'asc' ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
      });
  };

  // 获取所有标签
  const getAllTags = () => {
    const allTags: string[] = [];
    notes.forEach(note => {
      note.tags.forEach(tag => {
        if (!allTags.includes(tag)) {
          allTags.push(tag);
        }
      });
    });
    return allTags;
  };

  // 切换排序顺序
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  // 获取分类对应的颜色
  const getCategoryColor = (categoryName: string) => {
    const category = categories.find(c => c.name === categoryName);
    return category ? category.color : '#d9d9d9';
  };

  const filteredNotes = getFilteredNotes();
  const allTags = getAllTags();

  return (
    <div>
      <div style={{ 
        background: 'linear-gradient(120deg, #722ed1 0%, #13c2c2 100%)',
        borderRadius: '8px',
        padding: '24px',
        marginBottom: '24px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
      }}>
        <Title level={2} style={{ color: 'white', margin: 0, marginBottom: '8px', textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
          笔记管理
        </Title>
        <Paragraph style={{ color: 'rgba(255,255,255,0.85)', fontSize: '16px' }}>
          在这里您可以创建、编辑和管理您的所有笔记，支持Markdown格式
        </Paragraph>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={6}>
          <Card
            title={
              <Space>
                <FileTextOutlined style={{ color: '#722ed1' }} />
                <span>分类</span>
              </Space>
            }
            style={{ 
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              marginBottom: '16px',
              borderTop: '3px solid #722ed1'
            }}
          >
            <div
              className={selectedCategory === 'all' ? 'selected-category' : ''}
              style={{
                padding: '8px 16px',
                marginBottom: '8px',
                borderRadius: '4px',
                cursor: 'pointer',
                backgroundColor: selectedCategory === 'all' ? 'rgba(114, 46, 209, 0.1)' : 'transparent',
                color: selectedCategory === 'all' ? '#722ed1' : undefined,
                fontWeight: selectedCategory === 'all' ? 'bold' : 'normal',
              }}
              onClick={() => setSelectedCategory('all')}
            >
              全部笔记 ({notes.length})
            </div>
            
            {categories.map(category => (
              <div
                key={category.id}
                className={selectedCategory === category.name ? 'selected-category' : ''}
                style={{
                  padding: '8px 16px',
                  marginBottom: '8px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  backgroundColor: selectedCategory === category.name ? `rgba(${category.color.replace('#', '')}, 0.1)` : 'transparent',
                  color: selectedCategory === category.name ? category.color : undefined,
                  fontWeight: selectedCategory === category.name ? 'bold' : 'normal',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
                onClick={() => setSelectedCategory(category.name)}
              >
                <span>
                  <Tag color={category.color} style={{ marginRight: '8px' }}></Tag>
                  {category.name}
                </span>
                <span>
                  {notes.filter(note => note.category === category.name).length}
                </span>
              </div>
            ))}
          </Card>

          <Card
            title={
              <Space>
                <TagOutlined style={{ color: '#722ed1' }} />
                <span>标签</span>
              </Space>
            }
            style={{ 
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              borderTop: '3px solid #722ed1'
            }}
          >
            {allTags.length > 0 ? (
              <div>
                {allTags.map(tag => (
                  <Tag 
                    key={tag}
                    color={selectedTags.includes(tag) ? '#722ed1' : undefined}
                    style={{ 
                      margin: '0 8px 8px 0', 
                      cursor: 'pointer',
                      opacity: selectedTags.length > 0 && !selectedTags.includes(tag) ? 0.6 : 1
                    }}
                    onClick={() => {
                      if (selectedTags.includes(tag)) {
                        setSelectedTags(selectedTags.filter(t => t !== tag));
                      } else {
                        setSelectedTags([...selectedTags, tag]);
                      }
                    }}
                  >
                    {tag}
                  </Tag>
                ))}
                {selectedTags.length > 0 && (
                  <div style={{ marginTop: '8px' }}>
                    <Button 
                      type="link" 
                      size="small" 
                      onClick={() => setSelectedTags([])}
                      style={{ padding: 0 }}
                    >
                      清除筛选
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无标签" />
            )}
          </Card>
        </Col>
        
        <Col xs={24} md={18}>
          <Card 
            title={
              <Space>
                <FileTextOutlined style={{ color: '#722ed1' }} />
                <span>我的笔记</span>
              </Space>
            }
            extra={
              <Button type="primary" icon={<PlusOutlined />} onClick={() => showEditModal(null)}>
                添加笔记
              </Button>
            }
            style={{ 
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              borderTop: '3px solid #722ed1'
            }}
          >
            <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Input 
                placeholder="搜索笔记" 
                prefix={<SearchOutlined />} 
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
                style={{ width: '40%' }}
                allowClear
              />
              <Space>
                <Tooltip title={showOnlyFavorites ? "显示全部笔记" : "只显示收藏笔记"}>
                  <Button 
                    icon={showOnlyFavorites ? <StarFilled style={{ color: '#faad14' }} /> : <StarOutlined />} 
                    onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
                    type={showOnlyFavorites ? "primary" : "default"}
                  >
                    收藏
                  </Button>
                </Tooltip>
                <Tooltip title={sortOrder === 'desc' ? "切换为时间升序" : "切换为时间降序"}>
                  <Button 
                    icon={sortOrder === 'desc' ? <SortDescendingOutlined /> : <SortAscendingOutlined />} 
                    onClick={toggleSortOrder}
                  >
                    {sortOrder === 'desc' ? '最新优先' : '最早优先'}
                  </Button>
                </Tooltip>
              </Space>
            </div>

            {filteredNotes.length > 0 ? (
              <List
                itemLayout="vertical"
                dataSource={filteredNotes}
                renderItem={note => (
                  <List.Item
                    key={note.id}
                    actions={[
                      <Tooltip title="查看详情">
                        <Button 
                          type="text" 
                          icon={<EditOutlined />} 
                          onClick={() => handlePreview(note)}
                        />
                      </Tooltip>,
                      <Tooltip title="编辑笔记">
                        <Button 
                          type="text" 
                          icon={<EditOutlined />} 
                          onClick={() => showEditModal(note)}
                        />
                      </Tooltip>,
                      <Tooltip title="删除笔记">
                        <Button 
                          type="text" 
                          icon={<DeleteOutlined />} 
                          onClick={() => handleDelete(note)}
                          danger
                        />
                      </Tooltip>,
                      <Tooltip title={note.favorite ? "取消收藏" : "收藏笔记"}>
                        <Button 
                          type="text" 
                          icon={note.favorite ? <StarFilled style={{ color: '#faad14' }} /> : <StarOutlined />} 
                          onClick={() => toggleFavorite(note.id)}
                        />
                      </Tooltip>
                    ]}
                    style={{
                      background: '#fff',
                      borderRadius: '8px',
                      marginBottom: '8px',
                      padding: '16px',
                      transition: 'all 0.3s',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                      border: '1px solid #f0f0f0',
                      borderLeft: `3px solid ${getCategoryColor(note.category)}`
                    }}
                  >
                    <List.Item.Meta
                      title={
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Space>
                            {note.favorite && <StarFilled style={{ color: '#faad14' }} />}
                            <span>{note.title}</span>
                          </Space>
                          <Tag color={getCategoryColor(note.category)}>{note.category}</Tag>
                        </div>
                      }
                      description={
                        <div>
                          <div style={{ marginBottom: '8px', fontSize: '12px', color: 'rgba(0, 0, 0, 0.45)' }}>
                            更新于: {note.updatedAt}
                          </div>
                          <div>
                            {note.tags.map(tag => (
                              <Tag key={tag} style={{ marginRight: '8px' }}>{tag}</Tag>
                            ))}
                          </div>
                        </div>
                      }
                    />
                    <div style={{ margin: '12px 0' }}>
                      <Text ellipsis={true} style={{ color: 'rgba(0, 0, 0, 0.65)' }}>
                        {note.content.replace(/#/g, '').replace(/\*/g, '').substring(0, 150)}
                        {note.content.length > 150 ? '...' : ''}
                      </Text>
                    </div>
                  </List.Item>
                )}
              />
            ) : (
              <Empty description="没有找到符合条件的笔记" />
            )}
          </Card>
        </Col>
      </Row>

      {/* 编辑笔记对话框 */}
      <Modal
        title={currentNote ? "编辑笔记" : "添加笔记"}
        open={editNoteVisible}
        onCancel={() => setEditNoteVisible(false)}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
        >
          <Form.Item
            name="title"
            label="标题"
            rules={[{ required: true, message: '请输入笔记标题' }]}
          >
            <Input placeholder="请输入笔记标题" />
          </Form.Item>
          <Form.Item
            name="category"
            label="分类"
            rules={[{ required: true, message: '请选择笔记分类' }]}
          >
            <Select placeholder="请选择分类">
              {categories.map(category => (
                <Option key={category.id} value={category.name}>
                  <Tag color={category.color} style={{ marginRight: '8px' }}></Tag>
                  {category.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="tags"
            label="标签"
          >
            <Select
              mode="tags"
              placeholder="添加标签"
              style={{ width: '100%' }}
            >
              {allTags.map(tag => (
                <Option key={tag} value={tag}>{tag}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="content"
            label="内容 (支持Markdown格式)"
            rules={[{ required: true, message: '请输入笔记内容' }]}
          >
            <TextArea rows={12} placeholder="请输入笔记内容，支持Markdown格式" />
          </Form.Item>
          <Form.Item>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button style={{ marginRight: 8 }} onClick={() => setEditNoteVisible(false)}>
                取消
              </Button>
              <Button type="primary" htmlType="submit">
                保存
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>

      {/* 预览笔记对话框 */}
      <Modal
        title={currentNote?.title}
        open={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        footer={[
          <Button key="close" onClick={() => setPreviewVisible(false)}>
            关闭
          </Button>,
          <Button 
            key="edit" 
            type="primary" 
            onClick={() => {
              setPreviewVisible(false);
              if (currentNote) {
                showEditModal(currentNote);
              }
            }}
          >
            编辑
          </Button>,
        ]}
        width={800}
      >
        {currentNote && (
          <div>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <Tag color={getCategoryColor(currentNote.category)}>{currentNote.category}</Tag>
                <Text type="secondary">更新于: {currentNote.updatedAt}</Text>
              </div>
              <div>
                {currentNote.tags.map(tag => (
                  <Tag key={tag} style={{ marginRight: '8px' }}>{tag}</Tag>
                ))}
              </div>
            </div>
            <Divider />
            <div style={{ padding: '16px', maxHeight: '500px', overflow: 'auto' }}>
              <ReactMarkdown>
                {currentNote.content}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default NotesPage; 