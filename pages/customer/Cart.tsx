import React, { useState, useEffect } from 'react';
import { Layout, Card, Row, Col, Typography, Button, List, InputNumber, Empty, message } from 'antd';
import { DeleteOutlined, ShoppingOutlined, PlusOutlined, MinusOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const { Content } = Layout;
const { Title, Text } = Typography;

interface CartItem {
  id: number;
  productId: string;
  productName: string;
  productPrice: number;
  quantity: number;
  product: {
    imageUrl: string;
    description: string;
    seller: {
      shopName: string;
      city: string;
    };
  };
}

const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const BASE_IMAGE_URL = import.meta.env.VITE_API_BASE_URL || '';
  const navigate = useNavigate();


  const fetchCartItems = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/Order/cart-items`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
  
      // Handle the new response structure
      const items = response.data.items.$values.map((item: any) => ({
        id: item.id,
        productId: item.productId,
        productName: item.productName,
        productPrice: item.productPrice,
        quantity: item.quantity
      }));
  
      setCartItems(items);
    } catch (error) {
      console.error('Error fetching cart items:', error);
      message.error('Failed to fetch cart items');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId: number, newQuantity: number) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/Order/update-cart-item/${itemId}`,
        { quantity: newQuantity },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      fetchCartItems();
    } catch (error) {
      message.error('Failed to update quantity');
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  const handleQuantityChange = async (itemId: string, quantity: number) => {
    try {
      await axios.put(`/api/Cart/${itemId}`, { quantity });
      fetchCartItems();
    } catch (error) {
      message.error('Failed to update quantity');
    }
  };

  const handleRemoveItem = async (productId: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/api/Order/remove-from-cart/${productId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      fetchCartItems();
      message.success('Item removed from cart');
    } catch (error) {
      message.error('Failed to remove item');
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.productPrice * item.quantity), 0);
  };

  const handlePlaceOrder = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/Order/place-order`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      message.success('Order placed successfully!');
      setCartItems([]); // Clear cart after successful order
    } catch (error) {
      console.error('Error placing order:', error);
      message.error('Failed to place order. Please try again.');
    }
  };

  return (
    <Content style={{ padding: '24px', maxWidth: 1200, margin: '0 auto', width: '100%' }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0, color: '#4096ff' }}>Shopping Cart</Title>
        <Text type="secondary">Review and manage your items</Text>
      </div>

      {loading ? (
        <Card loading={true} />
      ) : cartItems.length === 0 ? (
        <Card>
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="Your cart is empty"
          >
            <Button
              type="primary"
              icon={<ShoppingOutlined />}
              onClick={() => {
                window.location.href = document.referrer || '/'; // Navigate back
                window.location.reload(); // Force refresh
              }}
            >
              Continue Shopping
            </Button>

          </Empty>
        </Card>
      ) : (
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={16}>
            <Card>
              <List
                itemLayout="horizontal"
                dataSource={cartItems}
                renderItem={item => (
                  <List.Item
                  actions={[
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => handleRemoveItem(item.productId)}
                    />
                  ]}
                >
                  <div style={{ display: 'flex', width: '100%', gap: '16px' }}>
                    <div style={{ flex: 1 }}>
                      <List.Item.Meta
                        title={item.productName}
                        
                      />
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                        <Button
                          icon={<MinusOutlined />}
                          onClick={() => item.quantity > 1 && updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        />
                        <InputNumber
                          min={1}
                          value={item.quantity}
                          onChange={(value) => value && updateQuantity(item.id, value)}
                          style={{ width: 60 }}
                        />
                        <Button
                          icon={<PlusOutlined />}
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        />
                        <div style={{ marginLeft: '16px', minWidth: '100px', textAlign: 'right' }}>
                          <Text strong>₹{((item.productPrice || 0) * item.quantity).toFixed(2)}</Text>
                          <div>
                            <Text type="secondary">₹{(item.productPrice || 0).toFixed(2)} each</Text>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </List.Item>
                )}
              />
            </Card>
          </Col>
          <Col xs={24} lg={8}>
            <Card>
              <div style={{ marginBottom: 16 }}>
                <Text strong>Order Summary</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <Text>Subtotal ({cartItems.length} items)</Text>
                <Text strong>${calculateTotal().toFixed(2)}</Text>
              </div>
              <Button
                type="primary"
                block
                size="large"
                onClick={handlePlaceOrder}
              >
                Proceed to Checkout
              </Button>
            </Card>
          </Col>
        </Row>
      )}
    </Content>
  );
};

export default Cart;