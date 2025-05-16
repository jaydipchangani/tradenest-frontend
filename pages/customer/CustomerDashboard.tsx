import React, { useState } from 'react';
import { Layout, Menu, Card, Row, Col, Typography, Statistic, Button, List, Avatar, Input, Badge } from 'antd';
import {
    HomeOutlined,
    ShoppingCartOutlined,
    UserOutlined,
    HeartOutlined,
    BellOutlined,
    SearchOutlined,
    ShoppingOutlined,
    TagOutlined,
    StarOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import Products from './Products';

const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;
const { Search } = Input;

const CustomerDashboard: React.FC = () => {
    const [currentView, setCurrentView] = useState('home');
    const navigate = useNavigate();
    const [cartCount] = useState(0);

    const handleNavClick = (e: any) => {
        switch (e.key) {
            case 'home':
                setCurrentView('home');
                break;
            case 'products':
                setCurrentView('products');
                break;
            case 'cart':
                navigate('cart');
                break;
            case 'orders':
                navigate('orders');
                break;
            case 'profile':
                navigate('profile');
                break;
            default:
                break;
        }
    };

    const recentProducts = [
        { id: 1, name: 'Wireless Headphones', price: '$89.99', image: 'https://via.placeholder.com/50' },
        { id: 2, name: 'Smart Watch', price: '$129.99', image: 'https://via.placeholder.com/50' },
        { id: 3, name: 'Bluetooth Speaker', price: '$59.99', image: 'https://via.placeholder.com/50' },
    ];


    const renderContent = () => {
        switch (currentView) {
            case 'products':
                return <Products />;
            default:
                return (
                    <>
                        <div style={{
                            background: 'linear-gradient(135deg, #4096ff 0%, #69b1ff 100%)',
                            borderRadius: 8,
                            padding: 24,
                            marginBottom: 24,
                            color: 'white'
                        }}>
                            <Title level={2} style={{ color: 'white', margin: 0 }}>Welcome back!</Title>
                            <Text style={{ color: 'rgba(255, 255, 255, 0.85)' }}>Discover amazing products and track your orders</Text>
                        </div>

                        <Row gutter={[24, 24]}>
          <Col xs={24} sm={8}>
            <Card 
              hoverable 
              style={{ borderRadius: 8, height: '100%' }}
              bodyStyle={{ padding: 20 }}
            >
              <Statistic 
                title="Your Orders" 
                value={0} 
                prefix={<ShoppingOutlined style={{ color: '#52c41a' }} />} 
              />
              <Button type="link" style={{ padding: 0, marginTop: 8 }}>View Orders</Button>
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card 
              hoverable 
              style={{ borderRadius: 8, height: '100%' }}
              bodyStyle={{ padding: 20 }}
            >
              <Statistic 
                title="Wishlist Items" 
                value={0} 
                prefix={<HeartOutlined style={{ color: '#ff4d4f' }} />} 
              />
              <Button type="link" style={{ padding: 0, marginTop: 8 }}>View Wishlist</Button>
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card 
              hoverable 
              style={{ borderRadius: 8, height: '100%' }}
              bodyStyle={{ padding: 20 }}
            >
              <Statistic 
                title="Notifications" 
                value={0} 
                prefix={<BellOutlined style={{ color: '#faad14' }} />} 
              />
              <Button type="link" style={{ padding: 0, marginTop: 8 }}>View All</Button>
            </Card>
          </Col>
        </Row>
        
                        <div style={{ marginTop: 24 }}>
                    <Title level={4}>Recently Viewed Products</Title>
                    <Card style={{ borderRadius: 8 }}>
                        <List
                            itemLayout="horizontal"
                            dataSource={recentProducts}
                            renderItem={item => (
                                <List.Item
                                    actions={[
                                        <Button type="primary" size="small" style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}>
                                            Add to Cart
                                        </Button>
                                    ]}
                                >
                                    <List.Item.Meta
                                        avatar={<Avatar src={item.image} shape="square" size={50} />}
                                        title={item.name}
                                        description={item.price}
                                    />
                                </List.Item>
                            )}
                        />
                    </Card>
                </div>
                    </>
                );
        }
    };

    return (
        <Layout style={{ minHeight: '100vh', backgroundColor: '#f5f7fa' }}>
            <Header style={{
                backgroundColor: 'white',
                padding: '0 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Title level={3} style={{ margin: 0, color: '#4096ff' }}>TradeNest</Title>
                </div>
                <Menu
                    mode="horizontal"
                    onClick={handleNavClick}
                    defaultSelectedKeys={['home']}
                    style={{ display: 'flex', justifyContent: 'space-around', borderBottom: 'none' }}
                >
                    <Menu.Item key="home" icon={<HomeOutlined />}>
                        Home
                    </Menu.Item>
                    <Menu.Item key="products" icon={<ShoppingOutlined />}>
                        Products
                    </Menu.Item>
                    <Menu.Item key="cart" icon={<ShoppingCartOutlined />}>
                        Cart
                    </Menu.Item>
                    <Menu.Item key="orders" icon={<ShoppingCartOutlined />}>
                        Orders
                    </Menu.Item>

                </Menu>
                <div style={{ display: 'flex', alignItems: 'center' }}>

                    <Badge count={cartCount} style={{ backgroundColor: '#4096ff' }}>
                        <Button
                            type="text"
                            icon={<ShoppingCartOutlined style={{ fontSize: 20 }} />}
                            onClick={() => navigate('/customer/cart')}
                        />
                    </Badge>
                    <Button type="text" icon={<UserOutlined style={{ fontSize: 20 }} />} onClick={() => navigate('/customer/profile')} />
                </div>
            </Header>

            <Content style={{ padding: '24px', maxWidth: 1200, margin: '0 auto', width: '100%' }}>
            {renderContent()}
  
            </Content>

            <Footer style={{ padding: 0, backgroundColor: 'white', boxShadow: '0 -2px 8px rgba(0,0,0,0.06)' }}>

            </Footer>
        </Layout>
    );
};

export default CustomerDashboard;