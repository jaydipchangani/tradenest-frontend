import React, { useState, useEffect } from 'react';
import { Table, Card, Button, Tag, message, Switch } from 'antd';
import axios from 'axios';

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    inventory: number;
    imageUrl: string;
    isActive: boolean;
    seller: {
      shopName: string;
      city: string;
    };
  }
  const BASE_IMAGE_URL = 'C:/TradeNest/TradeNestSolution/TradeNestSolution/wwwroot';
const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const columns = [
    {
        title: 'Image',
        key: 'image',
        render: (_, record: Product) => (
          <img 
            src={`${BASE_IMAGE_URL}${record.imageUrl}`}
            alt={record.name}
            style={{ 
              width: '50px', 
              height: '50px', 
              objectFit: 'cover',
              borderRadius: '4px'
            }}
          />
        ),
      },
    {
      title: 'Product Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Shop Name',
      key: 'shopName',
      render: (_, record: Product) => record.seller?.shopName || 'N/A',
    },
    {
      title: 'Seller City',
      key: 'city',
      render: (_, record: Product) => record.seller?.city || 'N/A',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `₹${price.toFixed(2)}`,
    },
    {
      title: 'Inventory',
      dataIndex: 'inventory',
      key: 'inventory',
    },
    {
      title: 'Active Status',
      key: 'activeStatus',
      render: (_, record: Product) => (
        <Switch
          checked={record.isActive}
          onChange={(checked) => handleToggleStatus(record.id, checked)}
        />
      ),
    },
  ];

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/products`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setProducts(response.data.$values);
  } catch (error) {
    message.error('Failed to fetch products');
  } finally {
    setLoading(false);
  }
};

  const handleToggleStatus = async (productId: string, status: boolean) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/toggle-product-status?productId=${productId}&isActive=${status}`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      message.success(`Product ${status ? 'activated' : 'deactivated'} successfully`);
      fetchProducts();
    } catch (error) {
      message.error('Failed to update product status');
    }
  };

  const handleVerification = async (id: string, action: 'approve' | 'reject') => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/verify-product/${id}?action=${action}`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      message.success(`Product ${action}d successfully`);
      fetchProducts();
    } catch (error) {
      message.error(`Failed to ${action} product`);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <Card title="Products Management" className="products-card">
      <Table 
        columns={columns} 
        dataSource={products}
        loading={loading}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />
    </Card>
  );
};

export default Products;