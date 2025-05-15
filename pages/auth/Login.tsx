import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '@ant-design/v5-patch-for-react-19';
import { message, Button, Input, Form, Checkbox, Typography, Divider } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import './Login.css';
import logo from 'C:/TradeNest/tradenest-frontend/assets/tradeNestLogo.png';

const { Text } = Typography;

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (values: any) => {
    setLoading(true);
    
    try {
      const response = await axios.post(
        `${(import.meta as any).env.VITE_API_BASE_URL}/api/Auth/login`,
        {
          email: values.email,
          password: values.password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
  
      const { token, refreshToken, email: userEmail, role, message: responseMessage } = response.data;
  
      // Save to localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('email', userEmail);
      localStorage.setItem('role', role.toString());
      
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', userEmail);
      } else {
        localStorage.removeItem('rememberedEmail');
      }
  
      message.success(responseMessage || 'Login successful');
  
      // Redirect based on role
      switch (Number(role)) {
        case 0: // Admin
          navigate('/admin/dashboard');
          break;
        case 1: // Seller
          navigate('/seller/dashboard');
          break;
        case 2: // Customer
          navigate('/customer/dashboard');
          break;
        default:
          message.error('Invalid user role.');
          break;
      }
    } catch (error: any) {
      console.error('Login failed:', error.response?.data || error.message);
      message.error(error.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Left side - Brand/Logo section */}
      <div className="login-brand-section">
        <div className="login-brand-content">
          <img src={logo} alt="TradeNest Logo" className="brand-logo" />
          <h1 className="login-brand-title">TradeNest</h1>
          <p className="login-brand-subtitle">Your trusted platform for seamless trading experiences.</p>
          <div className="login-features">
            <div className="login-feature-item">
              <div className="login-feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span>Secure transactions</span>
            </div>
            <div className="login-feature-item">
              <div className="login-feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span>Real-time market data</span>
            </div>
            <div className="login-feature-item">
              <div className="login-feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span>Personalized trading experience</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right side - Login form */}
      <div className="login-form-section">
        <div className="login-form-wrapper">
          <div className="login-header">
            <h2 className="login-title">Welcome Back</h2>
            <p className="login-subtitle">Please sign in to your account</p>
          </div>
          
          <div className="login-form-container">
            <Form
              name="login"
              initialValues={{ 
                email: localStorage.getItem('rememberedEmail') || '',
                remember: !!localStorage.getItem('rememberedEmail')
              }}
              onFinish={handleLogin}
              layout="vertical"
              size="large"
            >
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: 'Please enter your email' },
                  { type: 'email', message: 'Please enter a valid email' }
                ]}
              >
                <Input 
                  prefix={<UserOutlined className="input-icon" />} 
                  placeholder="Email" 
                  className="login-input"
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[{ required: true, message: 'Please enter your password' }]}
              >
                <Input.Password 
                  prefix={<LockOutlined className="input-icon" />} 
                  placeholder="Password" 
                  className="login-input"
                />
              </Form.Item>

              <div className="login-options">
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox onChange={e => setRememberMe(e.target.checked)}>Remember me</Checkbox>
                </Form.Item>
                <Link to="/auth/forgot-password" className="forgot-password">
                  Forgot password?
                </Link>
              </div>

              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  className="login-button"
                  loading={loading}
                >
                  Sign In
                </Button>
              </Form.Item>
            </Form>

            <div className="signup-prompt">
              <Text>
                Don't have an account?{' '}
                <Link to="/auth/register" className="signup-link">
                  Sign up
                </Link>
              </Text>
            </div>
          </div>
          
          <div className="login-footer">
            <p>© 2023 TradeNest. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;