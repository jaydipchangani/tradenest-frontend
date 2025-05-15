import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '@ant-design/v5-patch-for-react-19';
import {
  Form,
  Input,
  Button,
  Select,
  message as antMessage,
  Typography,
  Spin,
} from 'antd';
import { UserOutlined, LockOutlined, PhoneOutlined, HomeOutlined, ShopOutlined } from '@ant-design/icons';
import './Register.css';
import logo from 'C:/TradeNest/tradenest-frontend/assets/tradeNestLogo.png';

const { Title, Text } = Typography;
const { Option } = Select;

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [selectedRole, setSelectedRole] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const categoryOptions = [
    { label: 'Electronics', value: 1 },
    { label: 'Fashion', value: 2 },
    { label: 'Home & Kitchen', value: 3 },
    { label: 'Books', value: 4 },
    { label: 'Beauty & Health', value: 5 },
    { label: 'Sports & Outdoors', value: 6 },
    { label: 'Toys & Games', value: 7 },
  ];

  const handleRegister = async (values: any) => {
    setLoading(true);
    try {
      const payload = {
        email: values.email,
        password: values.password,
        role: selectedRole,
        fullName: values.fullName,
        phone: values.phone,
        address: values.address,
        city: values.city,
        shopName: selectedRole === 1 ? values.shopName : '',
        categoryIds: selectedRole === 1 ? values.categoryIds : [],
      };
  
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/Auth/register`,
        payload,
        { headers: { 'Content-Type': 'application/json' } }
      );
  
      setRegistrationSuccess(true);
      antMessage.success('Registration successful! After Admin Approval you can login yourself.');
      
      // Redirect to login page after 5 seconds
      setTimeout(() => {
        navigate('/auth/login');
      }, 5000);
    } catch (error: any) {
      console.error('Registration error:', error);
      const apiMessage =
        error.response?.data?.message || 'Registration failed, please try again.';
      antMessage.error(apiMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      {/* Left side - Brand/Logo section */}
      <div className="register-brand-section">
        <div className="register-brand-content">
          <img src={logo} alt="TradeNest Logo" className="brand-logo" />
          <h1 className="register-brand-title">TradeNest</h1>
          <p className="register-brand-subtitle">Join our community of traders and customers.</p>
          <div className="register-features">
      <div className="register-feature-item">
        <div className="register-feature-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
        <span>Easy account setup</span>
      </div>
      {/* Other feature items remain unchanged */}
    </div>
  </div>
</div>
      
      {/* Right side - Registration form */}
      <div className="register-form-section">
        <div className="register-form-wrapper">
          <div className="register-header">
            <h2 className="register-title">Create an Account</h2>
            <p className="register-subtitle">Join TradeNest today</p>
          </div>
          
          <div className="register-form-container">
            {registrationSuccess ? (
              <div className="registration-success">
                <div className="success-icon">✓</div>
                <Title level={4}>Registration Successful!</Title>
                <Text>After Admin Approval you can login yourself.</Text>
                <Text>Redirecting to login page in 5 seconds...</Text>
                <Spin />
              </div>
            ) : (
              <Form
                form={form}
                layout="vertical"
                onFinish={handleRegister}
                size="large"
              >
                <Form.Item
                  label="Select Role"
                  name="role"
                  rules={[{ required: true, message: 'Please select a role' }]}
                >
                  <Select onChange={(value) => setSelectedRole(value)}>
                    <Option value={1}>Seller</Option>
                    <Option value={2}>Customer</Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  label="Full Name"
                  name="fullName"
                  rules={[{ required: true, message: 'Please enter full name' }]}
                >
                  <Input prefix={<UserOutlined className="input-icon" />} />
                </Form.Item>

                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    { required: true, message: 'Please enter your email' },
                    { type: 'email', message: 'Please enter a valid email' },
                    {
                      validator: (_, value) =>
                        value && value.trim() !== ''
                          ? Promise.resolve()
                          : Promise.reject(new Error('Email cannot be empty or spaces')),
                    },
                  ]}
                >
                  <Input prefix={<UserOutlined className="input-icon" />} />
                </Form.Item>

                <Form.Item
                  label="Phone"
                  name="phone"
                  rules={[
                    { required: true, message: 'Please enter your phone number' },
                    {
                      pattern: /^[\d\s\-\+\(\)]{7,}$/,
                      message: 'Please enter a valid phone number',
                    },
                    {
                      validator: (_, value) =>
                        value && value.trim() !== ''
                          ? Promise.resolve()
                          : Promise.reject(new Error('Phone number cannot be empty or spaces')),
                    },
                  ]}
                >
                  <Input prefix={<PhoneOutlined className="input-icon" />} />
                </Form.Item>

                <Form.Item
                  label="Address"
                  name="address"
                  rules={[{ required: true, message: 'Please enter address' }]}
                >
                  <Input prefix={<HomeOutlined className="input-icon" />} />
                </Form.Item>

                <Form.Item
                  label="City"
                  name="city"
                  rules={[{ required: true, message: 'Please enter city' }]}
                >
                  <Input prefix={<HomeOutlined className="input-icon" />} />
                </Form.Item>

                {selectedRole === 1 && (
                  <>
                    <Form.Item
                      label="Shop Name"
                      name="shopName"
                      rules={[{ required: true, message: 'Please enter shop name' }]}
                    >
                      <Input prefix={<ShopOutlined className="input-icon" />} />
                    </Form.Item>

                    <Form.Item
                      label="Category"
                      name="categoryIds"
                      rules={[{ required: true, message: 'Please select at least one category' }]}
                    >
                      <Select mode="multiple" options={categoryOptions} />
                    </Form.Item>
                  </>
                )}

                <Form.Item
                  label="Password"
                  name="password"
                  rules={[
                    { required: true, message: 'Please enter password' },
                    {
                      pattern: /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/,
                      message: 'Password must be at least 8 characters, include uppercase & special character',
                    },
                  ]}
                  hasFeedback
                >
                  <Input.Password prefix={<LockOutlined className="input-icon" />} />
                </Form.Item>

                <Form.Item>
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    className="register-button"
                    loading={loading}
                  >
                    Register
                  </Button>
                </Form.Item>
              </Form>
            )}

            <div className="login-prompt">
              <Text>
                Already have an account?{' '}
                <Link to="/auth/login" className="login-link">
                  Sign in
                </Link>
              </Text>
            </div>
          </div>
          
          <div className="register-footer">
            <p>© 2023 TradeNest. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;