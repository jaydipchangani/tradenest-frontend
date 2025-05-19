import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, Menu, Card, Row, Col, Statistic, Typography, Button } from 'antd';
import axios from 'axios';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { Area, Column, Pie } from '@ant-design/charts';
import { 
  Home, 
  Package, 
  Settings, 
  ShoppingBag, 
  DollarSign, 
  TrendingUp,
  LogOut
} from 'lucide-react';
import './SellerDashboard.css';
import SellerOrders from '../../pages/seller/SellerOrders';
import SellerProducts from './SellerProducts';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

interface DashboardData {
  totalProducts: number;
  orders: {
    pending: number;
    approved: number;
    rejected: number;
  };
  totalRevenue: number;
}

const SellerDashboard = () => {
  const [selectedKey, setSelectedKey] = useState('dashboard');
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const renderOrdersChart = () => {
    const data = [
      { type: 'Pending Orders', value: dashboardData?.orders.pending || 0 },
      { type: 'Approved Orders', value: dashboardData?.orders.approved || 0 },
      { type: 'Rejected Orders', value: dashboardData?.orders.rejected || 0 },
    ];

    return (
      <div style={{ height: 300 }}>
        <Pie
          data={data}
          angleField="value"
          colorField="type"
          radius={0.8}
          label={{
            type: 'spider',
            formatter: (datum) => `${datum.type}: ${datum.value}`,
          }}
          color={['#fa8c16', '#52c41a', '#ff4d4f']}
          legend={{
            position: 'bottom',
          }}
          interactions={[
            {
              type: 'element-active',
            },
          ]}
        />
      </div>
    );
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/auth/login');
  };

  const handleMenuClick = ({ key }: { key: string }) => {
    setSelectedKey(key);
   
    if (key === 'settings') {
      navigate('/seller/settings');
    }
  };

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/Dashboard/overview`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setDashboardData(response.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedKey === 'dashboard') {
      fetchDashboardData();
    }
  }, [selectedKey]);
  

  const renderContent = () => {
    switch (selectedKey) {
      case 'orders':
        return <SellerOrders />;
      case 'products':
        return <SellerProducts />;
      default:
        return (
          <>
            <Title level={3} style={{ marginBottom: 24 }}>Dashboard Overview</Title>
            <Row gutter={[24, 24]}>
              <Col xs={24} sm={12} lg={8}>
                <Card hoverable>
                  <Statistic
                    title={<span style={{ fontSize: '16px', fontWeight: 'bold' }}>Total Products</span>}
                    value={dashboardData?.totalProducts || 0}
                    valueStyle={{ color: '#1890ff', fontSize: '24px' }}
                    prefix={<Package size={24} />}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={8}>
                <Card hoverable>
                  <Statistic
                    title={<span style={{ fontSize: '16px', fontWeight: 'bold' }}>Total Revenue</span>}
                    value={dashboardData?.totalRevenue || 0}
                    valueStyle={{ color: '#52c41a', fontSize: '24px' }}
                    prefix="₹"
                    precision={2}
                  />
                </Card>
              </Col>
            </Row>

            <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
              <Col xs={24} sm={12} lg={8}>
                <Card hoverable>
                  <Statistic
                    title={<span style={{ fontSize: '16px', fontWeight: 'bold' }}>Pending Orders</span>}
                    value={dashboardData?.orders.pending || 0}
                    valueStyle={{ color: '#fa8c16', fontSize: '24px' }}
                    prefix={<ShoppingBag size={24} />}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={8}>
                <Card hoverable>
                  <Statistic
                    title={<span style={{ fontSize: '16px', fontWeight: 'bold' }}>Approved Orders</span>}
                    value={dashboardData?.orders.approved || 0}
                    valueStyle={{ color: '#52c41a', fontSize: '24px' }}
                    prefix={<CheckCircleOutlined style={{ fontSize: '24px' }} />}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={8}>
                <Card hoverable>
                  <Statistic
                    title={<span style={{ fontSize: '16px', fontWeight: 'bold' }}>Rejected Orders</span>}
                    value={dashboardData?.orders.rejected || 0}
                    valueStyle={{ color: '#ff4d4f', fontSize: '24px' }}
                    prefix={<CloseCircleOutlined style={{ fontSize: '24px' }} />}
                  />
                </Card>
              </Col>
            </Row>

            <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
              <Col xs={24}>
                <Card title={<span style={{ fontSize: '16px', fontWeight: 'bold' }}>Orders Overview</span>}>
                  {renderOrdersChart()}
                </Card>
              </Col>
            </Row>
          </>
        );
    }
  };

  const menuItems = [
    { key: 'dashboard', label: 'Dashboard', icon: <Home size={20} /> },
    { key: 'products', label: 'My Products', icon: <Package size={20} /> },
    { key: 'orders', label: 'Orders', icon: <ShoppingBag size={20} /> },
    { key: 'analytics', label: 'Analytics', icon: <TrendingUp size={20} /> },
    { key: 'settings', label: 'Settings', icon: <Settings size={20} /> },
  ];

  return (
    <Layout className="seller-dashboard-layout">
      <Sider className="seller-dashboard-sider" theme="light">
        <div className="logo-container">
          <Title level={4} style={{ color: '#1890ff', margin: 0 }}>TradeNest Seller</Title>
        </div>
        <Menu
          mode="inline"
          defaultSelectedKeys={['dashboard']}
          selectedKeys={[selectedKey]}
          className="seller-dashboard-menu"
          items={menuItems}
          onClick={handleMenuClick}
        />
        <Button
          type="text"
          icon={<LogOut size={20} />}
          onClick={handleLogout}
          className="logout-button"
          danger
        >
          Logout
        </Button>
      </Sider>

      <Layout>
        <Header className="seller-dashboard-header">
          <div className="header-content">
            <div className="header-left">
              <div className="header-title">
                <Title level={4}>Seller Portal</Title>
              </div>
            </div>
            <div className="header-right">
              <Button 
                type="primary"
                icon={<LogOut size={16} />}
                onClick={handleLogout}
                className="header-logout-btn"
              >
                Logout
              </Button>
            </div>
          </div>
        </Header>

        <Content className="seller-dashboard-content">
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
  );
};

export default SellerDashboard;
