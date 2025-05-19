import React, { useState, useEffect } from 'react';
import { Layout, Card, Row, Col, Typography, Input, Select, Button, Tag, Pagination, message, Descriptions,Space } from 'antd';
import { ShoppingCartOutlined, HeartOutlined, FilterOutlined, CloseCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useDebounce } from 'use-debounce';

axios.defaults.baseURL = import.meta.env.VITE_API_URL;
axios.defaults.headers.common['Content-Type'] = 'application/json';

const { Content } = Layout;
const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

interface Category {
  id: number;
  name: string;
}
const CATEGORIES: Category[] = [
  { id: 1, name: 'Electronics' },
  { id: 2, name: 'Fashion' },
  { id: 3, name: 'Home & Kitchen' },
  { id: 4, name: 'Books' },
  { id: 5, name: 'Beauty & Health' },
  { id: 6, name: 'Sports & Outdoors' },
  { id: 7, name: 'Toys & Games' },
];
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

interface PaginatedResponse {
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  data: {
    $values: Product[];
  };
}

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [sortBy, setSortBy] = useState('Name');
  const [isDescending, setIsDescending] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const BASE_IMAGE_URL = import.meta.env.VITE_API_BASE_URL || '';
  const [quantities, setQuantities] = useState<{ [productId: string]: number }>({});
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>(undefined);

  const [debouncedSearchQuery] = useDebounce(searchQuery, 500);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get<PaginatedResponse>(
        `${import.meta.env.VITE_API_BASE_URL}/api/Product/db-paginated`, {
          params: {
            pageNumber: currentPage,
            pageSize: pageSize,
            sortBy: sortBy,
            isDescending: isDescending,
            searchQuery: debouncedSearchQuery || undefined,
            categoryId: selectedCategory // Add this line
          },
          headers: {
            'Accept': 'application/json'
          }
        }
      );
      
      // Check if response is valid JSON
      if (response.data && response.data.data?.$values) {
        setProducts(response.data.data.$values);
        setTotalRecords(response.data.totalRecords);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      message.error('Failed to fetch products. Please try again.');
      setProducts([]);
      setTotalRecords(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [currentPage, pageSize, sortBy, isDescending, debouncedSearchQuery, selectedCategory]);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleQuantityChange = (productId: string, value: number) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: value
    }));
  };

  const handleAddToCart = async (productId: string, productName:string,productPrice: number) => {
    const quantity = quantities[productId] || 1;
  
    try {
        const token = localStorage.getItem('token');
      
        await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/Order/add-to-cart`,
          {
           "productId":  productId,
            "quantity": quantity,
            "productName" :productName,
            "productPrice": productPrice
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          }
        );
      
        message.success('Added to cart successfully');
      } catch (error) {
        console.error(error);
        message.error('Failed to add to cart');
      }
      
  };


  
  
  const handleSortChange = (value: string) => {
    setCurrentPage(1);
    switch (value) {
      case 'price-low':
        setSortBy('Price');
        setIsDescending(false);
        break;
      case 'price-high':
        setSortBy('Price');
        setIsDescending(true);
        break;
      case 'name-asc':
        setSortBy('Name');
        setIsDescending(false);
        break;
      case 'name-desc':
        setSortBy('Name');
        setIsDescending(true);
        break;
      default:
        setSortBy('Name');
        setIsDescending(false);
    }
  };


  return (
    <Content style={{ padding: '16px', maxWidth: '100%', margin: '0 auto', width: '100%' }}>
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
  onChange={(e) => handleSearch(e.target.value)}
  allowClear
/>
          </Col>
        </Row>
      </div>

      <Row gutter={[16, 16]}>
  <Col xs={24}>
  <Card style={{ marginBottom: 16 }} loading={loading}>
  <Row justify="space-between" align="middle">
    <Col>
      <Text>Showing {products.length} of {totalRecords} products</Text>
    </Col>
    <Col>
      <Space size="middle">
      <Select
  placeholder="Select Category"
  style={{ width: 200 }}
  onChange={(value: number | undefined) => {
    setSelectedCategory(value);
    setCurrentPage(1);
  }}
  allowClear
  clearIcon={<CloseCircleOutlined />}
  defaultValue={undefined}
  value={selectedCategory}
>
  <Option value={undefined}>All Categories</Option>
  {CATEGORIES.map(category => (
    <Option key={category.id} value={category.id}>
      {category.name}
    </Option>
  ))}
</Select>
        <Select 
          defaultValue="name-asc" 
          style={{ width: 200 }}
          onChange={handleSortChange}
        >
          <Option value="name-asc">Name (A-Z)</Option>
          <Option value="name-desc">Name (Z-A)</Option>
          <Option value="price-low">Price: Low to High</Option>
          <Option value="price-high">Price: High to Low</Option>
        </Select>
      </Space>
    </Col>
  </Row>
</Card>

          <Row gutter={[16, 16]}>
          {products.filter(product => product.isActive).map(product => (
              <Col xs={24} sm={12} lg={8} key={product.id}>
                <Card
                  hoverable
                  loading={loading}
                  cover={
                    <img
  alt={product.name}
  src={`${BASE_IMAGE_URL}${product.imageUrl}`}
  style={{ height: 200, objectFit: 'cover' }}
  onError={(e) => {
    e.currentTarget.src = '/placeholder-image.png';
  }}
/>
                  }
                  actions={[
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                      <Button
                        onClick={() => handleQuantityChange(product.id, Math.max(1, (quantities[product.id] || 1) - 1))}
                        size="small"
                      >−</Button>
                  
                      <Input
                        type="number"
                        min={1}
                        max={product.inventory}
                        value={quantities[product.id] || 1}
                        onChange={(e) =>
                          handleQuantityChange(product.id, Math.min(product.inventory, Math.max(1, parseInt(e.target.value) || 1)))
                        }
                        style={{ width: 60, textAlign: 'center' }}
                        size="small"
                      />
                  
                      <Button
                        onClick={() =>
                          handleQuantityChange(
                            product.id,
                            Math.min(product.inventory, (quantities[product.id] || 1) + 1)
                          )
                        }
                        size="small"
                      >+</Button>
                    </div>,
                  
                    <Button
                      type="primary"
                      icon={<ShoppingCartOutlined />}
                      disabled={!product.isActive || product.inventory <= 0}
                      style={{ backgroundColor: '#4096ff', borderColor: '#4096ff' }}
                      onClick={() => handleAddToCart(product.id,product.name,product.price)}
                    >
                      Add to Cart
                    </Button>
                  ]}
                  
                  
                >
                  <Card.Meta
                    title={
                      <Row justify="space-between" align="middle">
                        <Text strong>{product.name}</Text>
                        <Text strong>${product.price.toFixed(2)}</Text>
                      </Row>
                    }
                    description={
                      <>
                        <Text type="secondary">{product.description}</Text>
                        
                      </>
                    }
                  />
                </Card>
              </Col>
            ))}
          </Row>

          <div style={{ marginTop: 24, textAlign: 'center' }}>
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={totalRecords}
              onChange={(page, size) => {
                setCurrentPage(page);
                setPageSize(size);
              }}
              showSizeChanger
              showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
            />
          </div>
        </Col>
      </Row>
    </Content>
  );
};

export default Products;