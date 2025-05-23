import React, { useState, useEffect } from 'react';
import { Table, Card, Tag, message, Button, Switch } from 'antd';
import axios from 'axios';
import ProductDrawer from './ProductDrawer';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  inventory: number;
  categoryId: number;
  isActive: boolean;
  stockThreshold: number;
}

const SellerProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  const BASE_IMAGE_URL = import.meta.env.VITE_API_BASE_URL || '';

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

  
  const handleInventoryChange = async (productId: string, increase: boolean, quantity: number = 1) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/Product/${increase ? 'increase' : 'decrease'}-inventory/${productId}`,
        {
            "quantity": 1
        },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'quantity': quantity
          },
        }
      );
      message.success(`Inventory ${increase ? 'increased' : 'decreased'} successfully`);
      fetchProducts();
    } catch (error) {
      message.error(`Failed to ${increase ? 'increase' : 'decrease'} inventory`);
    }
  };

  const columns = [
    {   
        title: 'S.No',
        dataIndex: 'id',
        key: 'id'

    },
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
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `₹${price.toFixed(2)}`,
    },
    {
      title: 'Inventory',
      dataIndex: 'inventory',
      key: 'inventory',
      render: (inventory: number, record: Product) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Button 
            size="small"
            onClick={() => handleInventoryChange(record.id, false)}
            disabled={inventory <= 0}
          >
            -
          </Button>
          <span style={{ color: inventory <= record.stockThreshold ? 'red' : 'inherit' }}>
            {inventory} {inventory <= record.stockThreshold && <Tag color="red">Low Stock</Tag>}
          </span>
          <Button 
            size="small"
            onClick={() => handleInventoryChange(record.id, true)}
          >
            +
          </Button>
        </div>
      ),
    },
    {
      title: 'Category',
      dataIndex: 'categoryId',
      key: 'categoryId',
      render: (categoryId: number) => (
        <Tag color="blue">{getCategoryName(categoryId)}</Tag>
      ),
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
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record: Product) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button 
            type="primary" 
            onClick={() => handleEditProduct(record)}
          >
            Edit
          </Button>
          <Button 
            type="primary" 
            danger
            onClick={() => handleDeleteProduct(record.id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/Product`,
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
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/Product/${productId}/toggle-active?isActive=${status}`,
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

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsDrawerOpen(true);
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/api/Product/${productId}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      message.success('Product deleted successfully');
      fetchProducts();
    } catch (error) {
      message.error('Failed to delete product');
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <Card 
      title="My Products" 
      className="seller-products-card"
      extra={
        <Button type="primary" onClick={() => setIsDrawerOpen(true)}>
          Add New Product
        </Button>
      }
    >
      <Table 
        columns={columns} 
        dataSource={products}
        loading={loading}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />

<ProductDrawer
  open={isDrawerOpen}
  onClose={() => {
    setIsDrawerOpen(false);
    setEditingProduct(null);
  }}
  onSuccess={fetchProducts}
  editProduct={editingProduct}
/>
    </Card>
  );
};

export default SellerProducts;