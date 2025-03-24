import React from 'react';
import { Typography, Row, Col, Card, Statistic, Button, Progress, Space, Tag, Divider } from 'antd';
import { 
  CheckCircleOutlined, 
  ClockCircleOutlined, 
  PlusOutlined, 
  CalendarOutlined, 
  FireOutlined,
  TrophyOutlined,
  ArrowUpOutlined,
  StarOutlined,
  UserOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Paragraph, Text } = Typography;

const HomePage: React.FC = () => {
  const navigate = useNavigate();

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
          欢迎回来，管理员
        </Title>
        <Paragraph style={{ color: 'rgba(255,255,255,0.85)', fontSize: '16px', marginBottom: '16px' }}>
          今天是个提高效率的好日子，开始规划您的任务吧!
        </Paragraph>
        <Space wrap>
          <Tag color="blue" icon={<StarOutlined />}>待办事项管理</Tag>
          <Tag color="blue" icon={<CalendarOutlined />}>日程安排</Tag>
          <Tag color="blue" icon={<FireOutlined />}>效率提升</Tag>
        </Space>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <Card 
            hoverable 
            style={{ height: '100%', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
            bodyStyle={{ padding: '24px' }}
          >
            <Statistic
              title={<Text strong style={{ fontSize: '16px' }}>总待办事项</Text>}
              value={8}
              valueStyle={{ color: '#1890ff', fontSize: '28px', fontWeight: 600 }}
              prefix={<ClockCircleOutlined style={{ marginRight: '8px' }} />}
            />
            <div style={{ marginTop: '16px' }}>
              <Text type="secondary">比上周增加了 2 项</Text>
              <Progress percent={75} showInfo={false} strokeColor="#1890ff" />
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card 
            hoverable 
            style={{ height: '100%', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
            bodyStyle={{ padding: '24px' }}
          >
            <Statistic
              title={<Text strong style={{ fontSize: '16px' }}>已完成</Text>}
              value={3}
              valueStyle={{ color: '#52c41a', fontSize: '28px', fontWeight: 600 }}
              prefix={<CheckCircleOutlined style={{ marginRight: '8px' }} />}
            />
            <div style={{ marginTop: '16px' }}>
              <Text type="secondary">今日完成了 1 项</Text>
              <Progress percent={37.5} showInfo={false} strokeColor="#52c41a" />
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card 
            hoverable 
            style={{ height: '100%', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
            bodyStyle={{ padding: '24px' }}
          >
            <Statistic
              title={<Text strong style={{ fontSize: '16px' }}>完成率</Text>}
              value={37.5}
              precision={1}
              valueStyle={{ color: '#fa8c16', fontSize: '28px', fontWeight: 600 }}
              suffix="%"
              prefix={<TrophyOutlined style={{ marginRight: '8px' }} />}
            />
            <div style={{ marginTop: '16px' }}>
              <Text type="secondary">
                比上周 <ArrowUpOutlined style={{ color: '#52c41a' }}/> 12.5%
              </Text>
              <Progress percent={37.5} showInfo={false} strokeColor="#fa8c16" />
            </div>
          </Card>
        </Col>
      </Row>

      <Divider style={{ margin: '24px 0' }}>
        <Text style={{ fontSize: '16px', color: '#8c8c8c' }}>快速操作</Text>
      </Divider>

      <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
        <Col xs={24} sm={8}>
          <Card 
            hoverable 
            style={{ 
              borderRadius: '8px', 
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              border: '1px solid #e6f7ff',
              background: 'linear-gradient(45deg, #f0f5ff 0%, #ffffff 100%)'
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <Button 
                type="primary" 
                icon={<PlusOutlined />} 
                onClick={() => navigate('/todos')}
                size="large"
                style={{ height: '48px', width: '100%', borderRadius: '6px' }}
              >
                创建新待办
              </Button>
              <Paragraph style={{ marginTop: '16px', color: '#8c8c8c' }}>
                快速添加一项新的待办事项
              </Paragraph>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card 
            hoverable 
            style={{ 
              borderRadius: '8px', 
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              border: '1px solid #f0f5ff',
              background: 'linear-gradient(45deg, #f6ffed 0%, #ffffff 100%)'
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <Button 
                onClick={() => navigate('/todos')} 
                size="large"
                icon={<CheckCircleOutlined />}
                style={{ height: '48px', width: '100%', borderRadius: '6px', borderColor: '#52c41a', color: '#52c41a' }}
              >
                查看所有待办
              </Button>
              <Paragraph style={{ marginTop: '16px', color: '#8c8c8c' }}>
                查看并管理您的所有待办事项
              </Paragraph>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card 
            hoverable 
            style={{ 
              borderRadius: '8px', 
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              border: '1px solid #fff7e6',
              background: 'linear-gradient(45deg, #fff7e6 0%, #ffffff 100%)'
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <Button 
                onClick={() => navigate('/profile')}
                size="large"
                icon={<UserOutlined />}
                style={{ height: '48px', width: '100%', borderRadius: '6px', borderColor: '#fa8c16', color: '#fa8c16' }}
              >
                个人信息设置
              </Button>
              <Paragraph style={{ marginTop: '16px', color: '#8c8c8c' }}>
                更新您的个人信息和偏好设置
              </Paragraph>
            </div>
          </Card>
        </Col>
      </Row>

      <Card 
        title={<Text strong>今日提示</Text>} 
        style={{ 
          marginTop: '24px', 
          borderRadius: '8px', 
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          borderTop: '3px solid #1890ff'
        }}
      >
        <Paragraph>
          <FireOutlined style={{ color: '#ff4d4f', marginRight: 8 }} />
          <Text>高效工作的秘诀是将待办事项按重要性和紧急程度进行分类，优先处理重要且紧急的事项。</Text>
        </Paragraph>
        <Paragraph>
          <FireOutlined style={{ color: '#ff4d4f', marginRight: 8 }} />
          <Text>每完成一项任务后，给自己适当的休息和奖励，有助于保持工作积极性。</Text>
        </Paragraph>
      </Card>
    </div>
  );
};

export default HomePage; 