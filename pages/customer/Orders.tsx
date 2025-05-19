import React, { useState, useEffect } from 'react';
import { Layout, Card, Row, Col, Typography, Table, Tag, Button, Empty, message, Modal, Statistic } from 'antd';
import { ShoppingOutlined, FileTextOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const { Content } = Layout;
const { Title, Text } = Typography;

interface OrderItem {
  productName: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  status: number;
}

interface Order {
  orderId: number;
  orderDate: string;
  totalAmount: number;
  categoryName: string;
  status: number;
  items: {
    $values: OrderItem[];
  };
}

const Orders: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [detailsVisible, setDetailsVisible] = useState(false);
    const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/Order/customer-orders`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
  
      if (response.data) {
        // Ensure we're working with an array
        const ordersData = Array.isArray(response.data) ? response.data : 
                          (response.data.$values ? response.data.$values : []);
        setOrders(ordersData);
        
        // Extract all order items into a flat array
        const allItems: OrderItem[] = [];
        ordersData.forEach((order: Order) => {
          if (order.items && order.items.$values && Array.isArray(order.items.$values)) {
            order.items.$values.forEach(item => {
              allItems.push({
                ...item,
                orderId: order.orderId,
                orderDate: order.orderDate
              });
            });
          }
        });
        setOrderItems(allItems);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      message.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusText = (status: number) => {
    switch (status) {
      case 0:
        return 'Pending';
      case 1:
        return 'Completed';
      case 2:
        return 'Cancelled';
      default:
        return 'Processing';
    }
  };

  const getStatusColor = (status: number) => {
    switch (status) {
      case 0:
        return 'blue';
      case 1:
        return 'green';
      case 2:
        return 'red';
      default:
        return 'orange';
    }
  };

  const getItemStatusText = (status: number) => {
    switch (status) {
      case 0:
        return 'Pending';
      case 1:
        return 'Accpeted';
      case 2:
        return 'Rejected';
      default:
        return 'Processing';
    }
  };

  const columns = [
    {
      title: 'Order ID',
      dataIndex: 'orderId',
      key: 'orderId',
    },
    {
      title: 'Product',
      dataIndex: 'productName',
      key: 'productName',
    },
    {
      title: 'Unit Price',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      render: (price: number) => `$${price.toFixed(2)}`,
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Total Price',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: (price: number) => `$${price.toFixed(2)}`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: number) => (
        <Tag color={getStatusColor(status)}>{getItemStatusText(status)}</Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record: any) => {
        const order = orders.find(o => o.orderId === record.orderId);
        return (
          <Button 
            type="primary" 
            icon={<FileTextOutlined />} 
            onClick={() => {
              if (order) {
                setSelectedOrder(order);
                setDetailsVisible(true);
              }
            }}
          >
            View Order
          </Button>
        );
      },
    },
  ];

  const itemColumns = [
    {
      title: 'Product',
      dataIndex: 'productName',
      key: 'productName',
    },
    {
      title: 'Unit Price',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      render: (price: number) => `$${price.toFixed(2)}`,
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Total Price',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: (price: number) => `$${price.toFixed(2)}`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: number) => (
        <Tag color={getStatusColor(status)}>{getItemStatusText(status)}</Tag>
      ),
    },
  ];

  return (
    <Content style={{ padding: '24px', maxWidth: 1200, margin: '0 auto', width: '100%' }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0, color: '#4096ff' }}>My Order Items</Title>
        <Text type="secondary">View all products from your orders</Text>
      </div>

      {loading ? (
        <Card loading={true} />
      ) : orderItems.length === 0 ? (
        <Card>
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="You haven't ordered any items yet"
          >
            <Button 
              type="primary" 
              icon={<ShoppingOutlined />} 
              onClick={() => navigate('/customer/products')}
            >
              Start Shopping
            </Button>
          </Empty>
        </Card>
      ) : (
        <Card>
          <Table 
            dataSource={orderItems} 
            columns={columns} 
            rowKey={(record) => `${record.orderId}-${record.productName}`}
            pagination={{ pageSize: 10 }}
          />
        </Card>
      )}

<Modal
  title={selectedOrder ? `Order #${selectedOrder.orderId} Details` : 'Order Details'}
  open={detailsVisible}
  onCancel={() => setDetailsVisible(false)}
  footer={[
    <Button key="close" onClick={() => setDetailsVisible(false)}>
      Close
    </Button>
  ]}
  width={800}
>
  {selectedOrder && (
    <>
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card size="small">
            <Statistic 
              title="Order Date" 
              value={new Date(selectedOrder.orderDate).toLocaleDateString()} 
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card size="small">
            <Statistic 
              title="Status" 
              value={getStatusText(selectedOrder.status)}
              valueStyle={{ color: getStatusColor(selectedOrder.status) === 'green' ? '#3f8600' : 
                            getStatusColor(selectedOrder.status) === 'red' ? '#cf1322' : '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card size="small">
            <Statistic 
              title="Total Amount" 
              value={selectedOrder.totalAmount} 
              precision={2}
              prefix="$"
            />
          </Card>
        </Col>
      </Row>

      <Title level={5}>Order Items</Title>
      <Table 
        dataSource={selectedOrder.items && selectedOrder.items.$values ? 
                   Array.isArray(selectedOrder.items.$values) ? 
                   selectedOrder.items.$values : [] : []} 
        columns={itemColumns} 
        rowKey="productName"
        pagination={false}
        summary={() => (
          <Table.Summary.Row>
            <Table.Summary.Cell index={0} colSpan={3}></Table.Summary.Cell>
            <Table.Summary.Cell index={3}>
              <Text strong>Total: ${selectedOrder.totalAmount.toFixed(2)}</Text>
            </Table.Summary.Cell>
            <Table.Summary.Cell index={4}></Table.Summary.Cell>
          </Table.Summary.Row>
        )}
      />
    </>
  )}
</Modal>
    </Content>
  );
};

export default Orders;