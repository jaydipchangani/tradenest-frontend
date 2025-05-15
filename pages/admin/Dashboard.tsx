import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Home,
  Users,
  ShoppingBag,
  Settings,
  LogOut,
  BarChart2,
  AlignVerticalJustifyStartIcon,
  Package,
} from 'lucide-react';
import { Layout, Menu, Button, Card, Row, Col, Typography, Statistic } from 'antd';
import './Dashboard.css';
import Sellers from '../../components/Admin/Sellers'
import Products from '../../components/Admin/Products';
import Orders from '../../components/Admin/Orders';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const Dashboard = () => {
  const [selectedKey, setSelectedKey] = useState('dashboard');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/auth/login');
  };

  const handleMenuClick = ({ key }: { key: string }) => {
    setSelectedKey(key);
  };

  const renderContent = () => {
    switch (selectedKey) {
      case 'sellers':
        return <Sellers />;
      case 'products':
        return <Products />;
        case 'orders':
      return <Orders />;
      default:
        return (
          <>
            <Row gutter={[24, 24]}>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Total Sellers"
                  value={42}
                  valueStyle={{ color: '#00557F' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Active Products"
                  value={156}
                  valueStyle={{ color: '#008A3C' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Total Customers"
                  value={890}
                  valueStyle={{ color: '#1CA3EC' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Total Orders"
                  value={267}
                  valueStyle={{ color: '#5DF249' }}
                />
              </Card>
            </Col>
          </Row>

          <Row gutter={[24, 24]} className="mt-6">
            <Col xs={24} lg={16}>
              <Card title="Recent Activity">
                <p>Activity list will go here...</p>
              </Card>
            </Col>
            <Col xs={24} lg={8}>
              <Card title="Quick Actions">
                <div className="quick-actions">
                  <Button type="primary" block className="mb-3">
                    Approve New Sellers
                  </Button>
                  <Button type="primary" block className="mb-3">
                    Review Products
                  </Button>
                  <Button type="primary" block>
                    Generate Reports
                  </Button>
                </div>
              </Card>
            </Col>
          </Row>
          </>
        );
    }
  };
  const menuItems = [
    { key: 'dashboard', label: 'Dashboard', icon: <Home size={20} /> },
    { key: 'sellers', label: 'Sellers', icon: <Users size={20} /> },
    { key: 'products', label: 'Products', icon: <ShoppingBag size={20} /> },
    { key: 'orders', label: 'Orders', icon: <Package size={20} /> }
  ];

  return (
    <Layout className="dashboard-layout">
      <Sider className="dashboard-sider">
        <div className="logo-container">
          <Title level={4} style={{ color: 'white', margin: 0 }}>TradeNest</Title>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['dashboard']}
          selectedKeys={[selectedKey]}
          className="dashboard-menu"
          items={menuItems}
          onClick={handleMenuClick}
        />
        <Button
          type="text"
          icon={<LogOut size={20} />}
          onClick={handleLogout}
          className="logout-button"
        >
          Logout
        </Button>
      </Sider>

      <Layout>
        <Header className="dashboard-header">
          <div className="header-content">
            <div className="header-left">
              <div className="header-title">
                <Title level={4}>TradeNest Admin</Title>
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
        


<Content className="dashboard-content">
          {renderContent()}
        </Content>

        
      </Layout>
    </Layout>
  );
};

export default Dashboard;