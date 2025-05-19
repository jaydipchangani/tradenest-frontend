import React, { useState, useEffect } from 'react';
import { Table, Card, Button, Tag, message, Switch } from 'antd';
import axios from 'axios';

interface Seller {
  id: string;
  userId: string;
  shopName: string;
  city: string;
  status: number;
  user: {
    isActive: boolean;
  };
}

const Sellers = () => {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(false);

  const columns = [
    {
      title: 'User ID',
      dataIndex: 'userId',
      key: 'userId',
    },
    {
      title: 'Shop Name',
      dataIndex: 'shopName',
      key: 'shopName',
    },
    {
      title: 'City',
      dataIndex: 'city',
      key: 'city',
    },
    {
      title: 'Active Status',
      key: 'activeStatus',
      render: (_, record: Seller) => (
        <Switch
          checked={record.user.isActive}
          onChange={(checked) => handleToggleStatus(record.userId, checked)}
          disabled={record.status === 0}
        />
      ),
    },

    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: number) => {
        let color = 'orange';
        let text = 'Pending';
        
        if (status === 1) {
          color = 'green';
          text = 'Approved';
        } else if (status === 2) {
          color = 'red';
          text = 'Rejected';
        }
        
        return (
          <Tag color={color}>
            {text}
          </Tag>
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record: Seller) => {
        if (record.status === 0) {
          return (
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button 
                type="primary" 
                onClick={() => handleVerification(record.id, 'approve')}
                style={{ backgroundColor: '#008A3C' }}
              >
                Approve
              </Button>
              <Button 
                type="primary" 
                danger
                onClick={() => handleVerification(record.id, 'reject')}
              >
                Reject
              </Button>
            </div>
          );
        }
        return <Button disabled>Action Completed</Button>;
      },
    },
  ];
  
  const handleToggleStatus = async (userId: string, status: boolean) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/toggle-seller-status?userId=${userId}&isActive=${status}`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      message.success(`Seller status ${status ? 'activated' : 'deactivated'} successfully`);
      fetchSellers();
    } catch (error) {
      message.error('Failed to update seller status');
    }
  };

  const handleVerification = async (id: string, action: 'approve' | 'reject') => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/verify-seller/${id}?action=${action}`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      message.success(`Seller ${action}d successfully`);
      fetchSellers();
    } catch (error) {
      message.error(`Failed to ${action} seller`);
    }
  };

  const fetchSellers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/sellers`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setSellers(response.data.$values);
    } catch (error) {
      message.error('Failed to fetch sellers');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (sellerId: string) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/approve-seller/${sellerId}`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      message.success('Seller approved successfully');
      fetchSellers();
    } catch (error) {
      message.error('Failed to approve seller');
    }
  };

  useEffect(() => {
    fetchSellers();
  }, []);

  return (
    <Card title="Sellers Management" className="sellers-card">
      <Table 
        columns={columns} 
        dataSource={sellers}
        loading={loading}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />
    </Card>
  );
};

export default Sellers;