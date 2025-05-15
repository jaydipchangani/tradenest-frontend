import React, { useState, useEffect } from 'react';
import { Table, Card, Tag, message } from 'antd';
import axios from 'axios';

interface Order {
    id: string;
    orderNumber: string;
    customerId: string;
    totalAmount: number;
    orderDate: string;
    status: number | string;
    categoryId: number;
  }

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const getCategoryName = (categoryId: number) => {
    const categories = {
      1: 'Electronics',
      2: 'Fashion',
      3: 'Home & Kitchen',
      4: 'Books',
      5: 'Beauty & Health',
      6: 'Sports & Outdoors',
      7: 'Toys & Games'
    };
    return categories[categoryId] || 'Unknown Category';
  };
  const columns = [
    {
      title: 'Order Number',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Customer Id',
      dataIndex: 'customerId',
      key: 'customerId',
    },
    {
      title: 'Total Amount',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount: number) => `₹${amount.toFixed(2)}`,
    },
    {
        title: 'Category',
        dataIndex: 'categoryId',
        key: 'categoryId',
        render: (categoryId: number) => (
          <Tag>{getCategoryName(categoryId)}</Tag>
        ),
      },
    {
      title: 'Order Date',
      dataIndex: 'orderDate',
      key: 'orderDate',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    
    {
        title: 'Order Status',
        dataIndex: 'status',
        key: 'status',
        render: (status: number | string) => {
          let color = 'blue';
          let statusText = String(status); // Convert to string
      
          switch (statusText.toLowerCase()) {
            case '0':
              color = 'orange';
              statusText = 'Pending';
              break;
            case '1':
              color = 'green';
              statusText = 'Approved';
              break;
            case '2':
              color = 'red';
              statusText = 'Rejected';
              break;
            
          }
          return <Tag color={color}>{statusText}</Tag>;
        },
      },
      
  ];

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/orders`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setOrders(response.data.$values);
    } catch (error) {
      message.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <Card title="Orders Management" className="orders-card">
      <Table 
        columns={columns} 
        dataSource={orders}
        loading={loading}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />
    </Card>
  );
};

export default Orders;