import React, { useState, useEffect } from 'react';
import { Table, Card, Tag, message, Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import axios from 'axios';

interface OrderItem {
  id: number;
  orderId: number;
  productId: string;
  sellerId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  status: number;
  pdfData: string;
}

const SellerOrders = () => {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(false);

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
      render: (price: number) => `₹${price.toFixed(2)}`,
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
      render: (price: number) => `₹${price.toFixed(2)}`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: number) => {
        let color = 'blue';
        let text = 'Processing';
        
        if (status === 0) {
          color = 'orange';
          text = 'Pending';
        } else if (status === 1) {
          color = 'green';
          text = 'Approved';
        } else if (status === 2) {
          color = 'red';
          text = 'Rejected';
        } 
        
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: OrderItem) => {
        return (
          <div style={{ display: 'flex', gap: '8px' }}>
            {record.status === 0 ? (
              <>
                <Button 
                  type="primary" 
                  onClick={() => handleProcessOrder(record.orderId, record.productId, true)}
                  style={{ backgroundColor: '#008A3C' }}
                >
                  Approve
                </Button>
                <Button 
                  type="primary" 
                  danger
                  onClick={() => handleProcessOrder(record.orderId, record.productId, false)}
                >
                  Reject
                </Button>
              </>
            ) : (
              <>
                <Button 
                  type="text" 
                  disabled
                  style={{ color: 'black', backgroundColor: '#f0f0f0' }}
                >
                  Action Completed
                </Button>
                <Button
                  type="primary"
                  onClick={() => handleDownloadInvoice(record.orderId)}
                  disabled={record.status !== 1}
                  icon={<DownloadOutlined />}
                >
                  Invoice
                </Button>
              </>
            )}
          </div>
        );
      },
    }
  ];

  const fetchOrderItems = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/Order/seller-order-items`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setOrderItems(response.data.$values);
    } catch (error) {
      message.error('Failed to fetch order items');
    } finally {
      setLoading(false);
    }
  };
  const handleDownloadInvoice = async (orderId: number) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/Order/download-invoice-pdf/${orderId}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          responseType: 'blob',
        }
      );
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      message.error('Failed to download invoice');
    }
  };
  const handleProcessOrder = async (orderItemId: number, productId: string, approve: boolean = true) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/Order/approve-order-item/${orderItemId}?approve=${approve}&productId=${productId}`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      message.success(`Order ${approve ? 'approved' : 'rejected'} successfully`);
      fetchOrderItems();
    } catch (error) {
      message.error(`Failed to ${approve ? 'approve' : 'reject'} order`);
    }
  };

 
  useEffect(() => {
    fetchOrderItems();
  }, []);

  return (
    <Card title="My Orders" className="seller-orders-card">
      <Table 
        columns={columns} 
        dataSource={orderItems}
        loading={loading}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />
    </Card>
  );
};

export default SellerOrders;