import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, Menu, Card, Row, Col, Statistic, Typography, Button } from 'antd';
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

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const SellerDashboard = () => {
  const [selectedKey, setSelectedKey] = useState('dashboard');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/auth/login');
  };

  const handleMenuClick = ({ key }: { key: string }) => {
    setSelectedKey(key);
    if (key === 'products') {
      navigate('/seller/products');
    } else if (key === 'settings') {
      navigate('/seller/settings');
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
          <Row gutter={[24, 24]}>
            <Col xs={24} sm={12} lg={8}>
              <Card>
                <Statistic
                  title="Total Products"
                  value={12}
                  valueStyle={{ color: '#1890ff' }}
                  prefix={<Package size={20} />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Card>
                <Statistic
                  title="Pending Orders"
                  value={5}
                  valueStyle={{ color: '#fa8c16' }}
                  prefix={<ShoppingBag size={20} />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Card>
                <Statistic
                  title="Total Revenue"
                  value={2450}
                  valueStyle={{ color: '#52c41a' }}
                  prefix={<DollarSign size={20} />}
                  suffix="₹"
                />
              </Card>
            </Col>
          </Row>

          <Row gutter={[24, 24]} className="mt-6">
            <Col xs={24} lg={16}>
              <Card title="Recent Orders" className="recent-orders-card">
                <p>Your recent orders will appear here...</p>
              </Card>
            </Col>
            <Col xs={24} lg={8}>
              <Card title="Quick Actions" className="quick-actions-card">
                <div className="quick-actions">
                  <Button type="primary" block className="mb-3">
                    Add New Product
                  </Button>
                  <Button type="default" block className="mb-3">
                    View Pending Orders
                  </Button>
                  <Button type="default" block>
                    Update Shop Profile
                  </Button>
                </div>
              </Card>
            </Col>
          </Row>
        </Content>
      </Layout>
    </Layout>
  );
};

export default SellerDashboard;
