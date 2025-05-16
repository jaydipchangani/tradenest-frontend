import React, { useState } from 'react';
import { Layout, Card, Row, Col, Typography, Input, Select, Button, Rate, Tag, Badge } from 'antd';
import { ShoppingCartOutlined, HeartOutlined, FilterOutlined } from '@ant-design/icons';

const { Header, Content } = Layout;
const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

const Products: React.FC = () => {
  const [sortBy, setSortBy] = useState('popular');

  // Mock products data
  const products = [
    {
      id: 1,
      name: 'Wireless Headphones',
      price: 89.99,
      rating: 4.5,
      image: 'https://via.placeholder.com/300',
      category: 'Electronics',
      inStock: true,
    },
    {
      id: 2,
      name: 'Smart Watch',
      price: 129.99,
      rating: 4.2,
      image: 'https://via.placeholder.com/300',
      category: 'Electronics',
      inStock: true,
    },
    // Add more products as needed
  ];

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#f5f7fa' }}>
      <Content style={{ padding: '24px', maxWidth: 1400, margin: '0 auto', width: '100%' }}>
        <div className="products-header" style={{ marginBottom: 24 }}>
          <Row gutter={[16, 16]} align="middle" justify="space-between">
            <Col>
              <Title level={2} style={{ margin: 0, color: '#4096ff' }}>Products</Title>
              <Text type="secondary">Browse our collection of quality products</Text>
            </Col>
            <Col>
              <Search
                placeholder="Search products..."
                style={{ width: 300 }}
                size="large"
              />
            </Col>
          </Row>
        </div>

        <Row gutter={[16, 16]}>
          <Col xs={24} md={6}>
            <Card style={{ marginBottom: 16 }}>
              <Title level={5}>
                <FilterOutlined /> Filters
              </Title>
              <div style={{ marginBottom: 16 }}>
                <Text strong>Category</Text>
                <Select style={{ width: '100%', marginTop: 8 }}>
                  <Option value="all">All Categories</Option>
                  <Option value="electronics">Electronics</Option>
                  <Option value="clothing">Clothing</Option>
                  <Option value="books">Books</Option>
                </Select>
              </div>
              <div style={{ marginBottom: 16 }}>
                <Text strong>Price Range</Text>
                <Select style={{ width: '100%', marginTop: 8 }}>
                  <Option value="all">All Prices</Option>
                  <Option value="0-50">$0 - $50</Option>
                  <Option value="51-100">$51 - $100</Option>
                  <Option value="101-200">$101 - $200</Option>
                  <Option value="201+">$201+</Option>
                </Select>
              </div>
              <div>
                <Text strong>Rating</Text>
                <Select style={{ width: '100%', marginTop: 8 }}>
                  <Option value="all">All Ratings</Option>
                  <Option value="4+">4+ Stars</Option>
                  <Option value="3+">3+ Stars</Option>
                  <Option value="2+">2+ Stars</Option>
                </Select>
              </div>
            </Card>
          </Col>

          <Col xs={24} md={18}>
            <Card style={{ marginBottom: 16 }}>
              <Row justify="space-between" align="middle">
                <Col>
                  <Text>Showing {products.length} products</Text>
                </Col>
                <Col>
                  <Select 
                    defaultValue={sortBy} 
                    style={{ width: 200 }}
                    onChange={(value) => setSortBy(value)}
                  >
                    <Option value="popular">Most Popular</Option>
                    <Option value="newest">Newest First</Option>
                    <Option value="price-low">Price: Low to High</Option>
                    <Option value="price-high">Price: High to Low</Option>
                  </Select>
                </Col>
              </Row>
            </Card>

            <Row gutter={[16, 16]}>
              {products.map(product => (
                <Col xs={24} sm={12} lg={8} key={product.id}>
                  <Card
                    hoverable
                    cover={
                      <img
                        alt={product.name}
                        src={product.image}
                        style={{ height: 200, objectFit: 'cover' }}
                      />
                    }
                    actions={[
                      <Button type="text" icon={<HeartOutlined />} />,
                      <Button 
                        type="primary" 
                        icon={<ShoppingCartOutlined />}
                        style={{ 
                          backgroundColor: '#4096ff',
                          borderColor: '#4096ff'
                        }}
                      >
                        Add to Cart
                      </Button>
                    ]}
                  >
                    <Card.Meta
                      title={
                        <Row justify="space-between" align="middle">
                          <Text strong>{product.name}</Text>
                          <Text strong>${product.price}</Text>
                        </Row>
                      }
                      description={
                        <>
                          <Rate disabled defaultValue={product.rating} style={{ fontSize: 12 }} />
                          <div style={{ marginTop: 8 }}>
                            <Tag color="blue">{product.category}</Tag>
                            {product.inStock ? (
                              <Tag color="success">In Stock</Tag>
                            ) : (
                              <Tag color="error">Out of Stock</Tag>
                            )}
                          </div>
                        </>
                      }
                    />
                  </Card>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default Products;