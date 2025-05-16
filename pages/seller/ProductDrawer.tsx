import React, { useEffect, useState } from 'react';
import { Drawer, Form, Input, InputNumber, Select, Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';

interface ProductDrawerProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
    editProduct?: Product | null;
  }
  interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    categoryId: number;
    inventory: number;
    stockThreshold: number;
    imageUrl?: string;
  }
  
  const ProductDrawer: React.FC<ProductDrawerProps> = ({ open, onClose, onSuccess, editProduct }) => {
    const [form] = Form.useForm();
    const [imageFile, setImageFile] = useState<File | null>(null);

  const categories = {
    1: 'Electronics',
    2: 'Fashion',
    3: 'Home & Kitchen',
    4: 'Books',
    5: 'Beauty & Health',
    6: 'Sports & Outdoors',
    7: 'Toys & Games'
  };

  const handleImageChange = (info: any) => {
    if (info.file) {
      setImageFile(info.file.originFileObj);
    }
  };

  useEffect(() => {
    if (editProduct) {
      form.setFieldsValue({
        name: editProduct.name,
        description: editProduct.description,
        price: editProduct.price,
        categoryId: editProduct.categoryId,
        inventory: editProduct.inventory,
        stockThreshold: editProduct.stockThreshold,
      });
      if (editProduct.imageUrl) {
        form.setFieldsValue({
          image: [{
            uid: '-1',
            name: 'Current Image',
            status: 'done',
            url: editProduct.imageUrl,
          }]
        });
      }
    } else {
      form.resetFields();
    }
  }, [editProduct, form]);

  const handleAddProduct = async (values: any) => {
    try {
      const formData = new FormData();
      formData.append('Name', values.name);
      formData.append('Description', values.description);
      formData.append('Price', values.price.toString());
      formData.append('CategoryId', values.categoryId.toString());
      formData.append('Inventory', values.inventory.toString());
      formData.append('StockThreshold', '10');  

      const file = values.image?.[0]?.originFileObj || imageFile;
      if (!file) {
        message.error('Please upload an image');
        return;
      }
      formData.append('Image', file);

      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/Product`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      message.success('Product added successfully');
      setImageFile(null);
      form.resetFields();
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error details:', error.response?.data);
      message.error(error.response?.data?.errors?.Image?.[0] || 'Failed to add product');
    }
  };

  const beforeUpload = (file: File) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG files!');
      return Upload.LIST_IGNORE;
    }
  
    // 5MB limit
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('Image must be smaller than 5MB!');
      return Upload.LIST_IGNORE;
    }
  
    return false;
  };

  const handleSubmit = async (values: any) => {
    try {
      const formData = new FormData();
      formData.append('Name', values.name);
      formData.append('Description', values.description);
      formData.append('Price', values.price.toString());
      formData.append('CategoryId', values.categoryId.toString());
      formData.append('Inventory', values.inventory.toString());
      formData.append('StockThreshold', '10');

      const file = values.image?.[0]?.originFileObj || imageFile;
      if (!editProduct && !file) {
        message.error('Please upload an image');
        return;
      }
      if (file) {
        formData.append('Image', file);
      }

      const url = editProduct 
        ? `${import.meta.env.VITE_API_BASE_URL}/api/Product/${editProduct.id}`  // Using S.No from product table
        : `${import.meta.env.VITE_API_BASE_URL}/api/Product`;

      console.log('Request URL:', url); // Add logging to verify the URL

      await axios({
        method: editProduct ? 'put' : 'post',
        url,
        data: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      message.success(`Product ${editProduct ? 'updated' : 'added'} successfully`);
      setImageFile(null);
      form.resetFields();
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error details:', error.response?.data);
      message.error(error.response?.data?.errors?.Image?.[0] || `Failed to ${editProduct ? 'update' : 'add'} product`);
    }
  };

  return (
    <Drawer
      title={editProduct ? "Edit Product" : "Add New Product"}
      placement="right"
      onClose={onClose}
      open={open}
      width={400}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          name="name"
          label="Product Name"
          rules={[{ required: true, message: 'Please enter product name' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: 'Please enter description' }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item
          name="price"
          label="Price"
          rules={[{ required: true, message: 'Please enter price' }]}
        >
          <InputNumber
            min={0}
            prefix="₹"
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Form.Item
          name="categoryId"
          label="Category"
          rules={[{ required: true, message: 'Please select category' }]}
        >
          <Select >
            {Object.entries(categories).map(([id, name]) => (
              <Select.Option key={id} value={parseInt(id)}>
                {name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="inventory"
          label="Inventory"
          rules={[
            { required: true, message: 'Please enter inventory' },
            { type: 'number', min: 10, message: 'Minimum inventory should be 10' }
          ]}
        >
          <InputNumber
            min={10}
            style={{ width: '100%' }}
            placeholder="Enter product inventory (minimum 10)"
          />
        </Form.Item>

        <Form.Item
          name="image"
          label="Product Image"
          rules={[{ required: !editProduct, message: 'Please upload an image' }]}
          valuePropName="fileList"
          getValueFromEvent={(e) => {
            if (Array.isArray(e)) {
              return e;
            }
            return e?.fileList;
          }}
        >
          <Upload
            maxCount={1}
            listType="picture"
            beforeUpload={beforeUpload}
            onChange={handleImageChange}
            accept=".jpg,.jpeg,.png"
          >
            <Button icon={<UploadOutlined />}>
              {editProduct ? 'Update Image (Optional)' : 'Upload Image (Max: 5MB)'}
            </Button>
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            {editProduct ? 'Update Product' : 'Add Product'}
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  );
};
export default ProductDrawer;