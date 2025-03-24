import React, { useState } from 'react';
import { Calendar, Badge, Card, Typography, Row, Col, Modal, Form, Input, DatePicker, Select, TimePicker, Button, Tag, Alert, Tooltip, Space } from 'antd';
import { PlusOutlined, ClockCircleOutlined, CheckCircleOutlined, CalendarOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

interface Event {
  id: number;
  title: string;
  content: string;
  startTime: string;
  endTime: string;
  type: 'success' | 'processing' | 'error' | 'warning' | 'default';
  status: 'completed' | 'pending' | 'overdue';
}

const CalendarPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([
    { id: 1, title: '团队会议', content: '讨论项目进度', startTime: '2025-03-24 10:00:00', endTime: '2025-03-24 11:30:00', type: 'processing', status: 'completed' },
    { id: 2, title: '提交周报', content: '提交本周工作总结', startTime: '2025-03-25 17:00:00', endTime: '2025-03-25 18:00:00', type: 'warning', status: 'pending' },
    { id: 3, title: '客户沟通', content: '与客户讨论需求变更', startTime: '2025-03-26 14:00:00', endTime: '2025-03-26 15:00:00', type: 'success', status: 'pending' },
    { id: 4, title: '代码评审', content: '评审新功能代码', startTime: '2025-03-27 11:00:00', endTime: '2025-03-27 12:00:00', type: 'error', status: 'overdue' },
  ]);
  
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [viewMode, setViewMode] = useState<'month' | 'year'>('month');

  // 根据日期获取事件
  const getEventsByDate = (date: Dayjs) => {
    return events.filter(event => {
      const eventDate = dayjs(event.startTime).format('YYYY-MM-DD');
      const targetDate = date.format('YYYY-MM-DD');
      return eventDate === targetDate;
    });
  };

  // 日历单元格的渲染
  const dateCellRender = (date: Dayjs) => {
    const listData = getEventsByDate(date);
    return (
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {listData.map(item => (
          <li key={item.id} style={{ margin: '3px 0' }}>
            <Tooltip title={`${item.title} (${dayjs(item.startTime).format('HH:mm')} - ${dayjs(item.endTime).format('HH:mm')})`}>
              <Badge 
                status={item.type as any} 
                text={
                  <Text 
                    ellipsis={true} 
                    style={{
                      maxWidth: '90%',
                      display: 'inline-block',
                      textDecoration: item.status === 'completed' ? 'line-through' : 'none',
                      color: item.status === 'overdue' ? '#f5222d' : undefined
                    }}
                  >
                    {item.title}
                  </Text>
                } 
                onClick={() => handleEventClick(item)}
                style={{ cursor: 'pointer' }}
              />
            </Tooltip>
          </li>
        ))}
      </ul>
    );
  };

  // 处理添加事件
  const handleAddEvent = () => {
    setSelectedEvent(null);
    setVisible(true);
    if (selectedDate) {
      form.setFieldsValue({
        date: selectedDate,
        startTime: dayjs(selectedDate).hour(9).minute(0),
        endTime: dayjs(selectedDate).hour(10).minute(0),
        type: 'processing',
      });
    } else {
      form.resetFields();
    }
  };

  // 处理事件点击
  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setVisible(true);
    form.setFieldsValue({
      title: event.title,
      content: event.content,
      date: dayjs(event.startTime),
      startTime: dayjs(event.startTime),
      endTime: dayjs(event.endTime),
      type: event.type,
      status: event.status,
    });
  };

  // 处理保存事件
  const handleSave = (values: any) => {
    const { title, content, date, startTime, endTime, type, status } = values;
    
    // 格式化日期时间
    const formattedStartTime = dayjs(date)
      .hour(startTime.hour())
      .minute(startTime.minute())
      .format('YYYY-MM-DD HH:mm:ss');
    
    const formattedEndTime = dayjs(date)
      .hour(endTime.hour())
      .minute(endTime.minute())
      .format('YYYY-MM-DD HH:mm:ss');
    
    if (selectedEvent) {
      // 更新事件
      setEvents(events.map(event => 
        event.id === selectedEvent.id 
          ? { ...event, title, content, startTime: formattedStartTime, endTime: formattedEndTime, type, status } 
          : event
      ));
    } else {
      // 添加新事件
      const newEvent: Event = {
        id: Date.now(),
        title,
        content,
        startTime: formattedStartTime,
        endTime: formattedEndTime,
        type,
        status: status || 'pending',
      };
      setEvents([...events, newEvent]);
    }
    
    setVisible(false);
  };

  // 处理日期选择
  const handleDateSelect = (date: Dayjs) => {
    setSelectedDate(date);
  };

  // 处理删除事件
  const handleDeleteEvent = () => {
    if (selectedEvent) {
      Modal.confirm({
        title: '确认删除',
        icon: <ExclamationCircleOutlined />,
        content: `确定要删除事件"${selectedEvent.title}"吗？`,
        okText: '确认',
        cancelText: '取消',
        onOk() {
          setEvents(events.filter(event => event.id !== selectedEvent.id));
          setVisible(false);
        },
      });
    }
  };

  // 生成今日日程
  const getTodayEvents = () => {
    const today = dayjs().format('YYYY-MM-DD');
    return events.filter(event => dayjs(event.startTime).format('YYYY-MM-DD') === today);
  };

  // 生成明日日程
  const getTomorrowEvents = () => {
    const tomorrow = dayjs().add(1, 'days').format('YYYY-MM-DD');
    return events.filter(event => dayjs(event.startTime).format('YYYY-MM-DD') === tomorrow);
  };

  const todayEvents = getTodayEvents();
  const tomorrowEvents = getTomorrowEvents();

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
          日程安排
        </Title>
        <Paragraph style={{ color: 'rgba(255,255,255,0.85)', fontSize: '16px' }}>
          在这里您可以查看和管理您的日程安排，添加新事件并跟踪您的日程
        </Paragraph>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={16}>
          <Card 
            title={
              <Space>
                <CalendarOutlined style={{ color: '#1890ff' }} />
                <span>日历视图</span>
              </Space>
            }
            extra={
              <Button type="primary" icon={<PlusOutlined />} onClick={handleAddEvent}>
                添加事件
              </Button>
            }
            style={{ 
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              borderTop: '3px solid #1890ff'
            }}
          >
            <Calendar 
              dateCellRender={dateCellRender} 
              onSelect={handleDateSelect}
              mode={viewMode}
              onPanelChange={(date, mode) => setViewMode(mode as 'month' | 'year')}
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card 
            title={
              <Space>
                <ClockCircleOutlined style={{ color: '#1890ff' }} />
                <span>今日日程</span>
              </Space>
            }
            style={{ 
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              marginBottom: '16px',
              borderTop: '3px solid #1890ff'
            }}
          >
            {todayEvents.length > 0 ? (
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {todayEvents.map(event => (
                  <li key={event.id} style={{ marginBottom: '12px', borderLeft: `3px solid ${event.type === 'success' ? '#52c41a' : event.type === 'processing' ? '#1890ff' : event.type === 'warning' ? '#faad14' : event.type === 'error' ? '#f5222d' : '#d9d9d9'}`, paddingLeft: '10px' }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <Text strong style={{ 
                        textDecoration: event.status === 'completed' ? 'line-through' : 'none',
                        color: event.status === 'overdue' ? '#f5222d' : undefined
                      }}>
                        {event.title}
                      </Text>
                      <Tag color={
                        event.status === 'completed' ? 'success' : 
                        event.status === 'overdue' ? 'error' : 'processing'
                      }>
                        {event.status === 'completed' ? '已完成' : event.status === 'overdue' ? '已逾期' : '待处理'}
                      </Tag>
                    </div>
                    <Text type="secondary" style={{ display: 'block', fontSize: '12px' }}>
                      {dayjs(event.startTime).format('HH:mm')} - {dayjs(event.endTime).format('HH:mm')}
                    </Text>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      {event.content}
                    </Text>
                  </li>
                ))}
              </ul>
            ) : (
              <Alert message="今日暂无日程安排" type="info" showIcon />
            )}
          </Card>

          <Card 
            title={
              <Space>
                <CalendarOutlined style={{ color: '#1890ff' }} />
                <span>明日日程</span>
              </Space>
            }
            style={{ 
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              borderTop: '3px solid #1890ff'
            }}
          >
            {tomorrowEvents.length > 0 ? (
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {tomorrowEvents.map(event => (
                  <li key={event.id} style={{ marginBottom: '12px', borderLeft: `3px solid ${event.type === 'success' ? '#52c41a' : event.type === 'processing' ? '#1890ff' : event.type === 'warning' ? '#faad14' : event.type === 'error' ? '#f5222d' : '#d9d9d9'}`, paddingLeft: '10px' }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <Text strong>{event.title}</Text>
                      <Tag color={
                        event.status === 'completed' ? 'success' : 
                        event.status === 'overdue' ? 'error' : 'processing'
                      }>
                        {event.status === 'completed' ? '已完成' : event.status === 'overdue' ? '已逾期' : '待处理'}
                      </Tag>
                    </div>
                    <Text type="secondary" style={{ display: 'block', fontSize: '12px' }}>
                      {dayjs(event.startTime).format('HH:mm')} - {dayjs(event.endTime).format('HH:mm')}
                    </Text>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      {event.content}
                    </Text>
                  </li>
                ))}
              </ul>
            ) : (
              <Alert message="明日暂无日程安排" type="info" showIcon />
            )}
          </Card>
        </Col>
      </Row>

      {/* 事件表单Modal */}
      <Modal
        title={selectedEvent ? "编辑事件" : "添加事件"}
        open={visible}
        onCancel={() => setVisible(false)}
        footer={null}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
          initialValues={{
            type: 'processing',
            status: 'pending'
          }}
        >
          <Form.Item
            name="title"
            label="事件标题"
            rules={[{ required: true, message: '请输入事件标题' }]}
          >
            <Input placeholder="请输入事件标题" />
          </Form.Item>
          <Form.Item
            name="content"
            label="事件内容"
          >
            <TextArea rows={3} placeholder="请输入事件内容" />
          </Form.Item>
          <Form.Item
            name="date"
            label="日期"
            rules={[{ required: true, message: '请选择日期' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="startTime"
                label="开始时间"
                rules={[{ required: true, message: '请选择开始时间' }]}
              >
                <TimePicker format="HH:mm" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="endTime"
                label="结束时间"
                rules={[{ required: true, message: '请选择结束时间' }]}
              >
                <TimePicker format="HH:mm" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="type"
            label="事件类型"
            rules={[{ required: true, message: '请选择事件类型' }]}
          >
            <Select placeholder="请选择事件类型">
              <Option value="processing">普通事件</Option>
              <Option value="success">重要事件</Option>
              <Option value="warning">警告事件</Option>
              <Option value="error">紧急事件</Option>
              <Option value="default">次要事件</Option>
            </Select>
          </Form.Item>
          {selectedEvent && (
            <Form.Item
              name="status"
              label="事件状态"
              rules={[{ required: true, message: '请选择事件状态' }]}
            >
              <Select placeholder="请选择事件状态">
                <Option value="pending">待处理</Option>
                <Option value="completed">已完成</Option>
                <Option value="overdue">已逾期</Option>
              </Select>
            </Form.Item>
          )}
          <Form.Item>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button onClick={() => setVisible(false)}>
                取消
              </Button>
              <div>
                {selectedEvent && (
                  <Button danger style={{ marginRight: 8 }} onClick={handleDeleteEvent}>
                    删除
                  </Button>
                )}
                <Button type="primary" htmlType="submit">
                  保存
                </Button>
              </div>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CalendarPage; 