import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Select, Typography, message } from 'antd';

const { Title } = Typography;
const { Option } = Select;

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = (values: any) => {
    setLoading(true);

    // Simulate API call for login
    setTimeout(() => {
      setLoading(false);

      // Here you call your real API and get user data with role
      // For demo, just use selected role
      const { role } = values;

      // Save userRole in localStorage (replace with secure storage & auth token)
      localStorage.setItem('userRole', role);

      // Redirect based on role
      switch (role) {
        case 'admin':
          navigate('/admin/dashboard');
          break;
        case 'seller':
          navigate('/seller/dashboard');
          break;
        case 'customer':
          navigate('/customer/dashboard');
          break;
        default:
          message.error('Invalid role selected');
      }
    }, 1000);
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto', marginTop: 80, padding: 20, border: '1px solid #ccc', borderRadius: 8 }}>
      <Title level={3} style={{ textAlign: 'center' }}>TradNest Login</Title>

      <Form name="login" onFinish={onFinish} layout="vertical">
        <Form.Item name="username" label="Username" rules={[{ required: true, message: 'Please input your username' }]}>
          <Input placeholder="Username" />
        </Form.Item>

        <Form.Item name="password" label="Password" rules={[{ required: true, message: 'Please input your password' }]}>
          <Input.Password placeholder="Password" />
        </Form.Item>

        <Form.Item name="role" label="Login as" rules={[{ required: true, message: 'Please select your role' }]}>
          <Select placeholder="Select role">
            <Option value="admin">Admin</Option>
            <Option value="seller">Seller</Option>
            <Option value="customer">Customer</Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Login
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
