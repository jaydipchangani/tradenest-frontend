import React from 'react';
import { Navigate, Route, Routes, Outlet } from 'react-router-dom';

// Pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';

import AdminDashboard from '../pages/admin/Dashboard';
// import SellersList from '../pages/admin/SellersList';
// import AdminProductsList from '../pages/admin/ProductsList';

// import SellerDashboard from '../pages/seller/Dashboard';
// import SellerProducts from '../pages/seller/SellerProducts';

// import CustomerDashboard from '../pages/customer/Dashboard';
// import CustomerProductsList from '../pages/customer/ProductsList';
// import Cart from '../pages/customer/Cart';

import NotFound from '../pages/NotFound';
import SellerDashboard from '../pages/seller/SellerDashboard';
import CustomerDashboard from '../pages/customer/CustomerDashboard';

// Dummy auth & role check - Replace with actual auth logic
const getUserRole = (): 'admin' | 'seller' | 'customer' | null => {
    const roleNumber = Number(localStorage.getItem('role'));
    
    switch (roleNumber) {
      case 0:
        return 'admin';
      case 1:
        return 'seller';
      case 2:
        return 'customer';
      default:
        return null;
    }
  };

  const PrivateRoute: React.FC<{ allowedRoles: string[] }> = ({ allowedRoles }) => {
    const role = getUserRole();
  
    if (!role) {
      return <Navigate to="/auth/login" replace />;
    }
  
    if (!allowedRoles.includes(role)) {
      // Redirect to appropriate dashboard based on role
      switch (role) {
        case 'admin':
          return <Navigate to="/admin/dashboard" replace />;
        case 'seller':
          return <Navigate to="/seller/dashboard" replace />;
        case 'customer':
          return <Navigate to="/customer/dashboard" replace />;
        default:
          return <Navigate to="/auth/login" replace />;
      }
    }
  
    return <Outlet />;
  };

  const AppRoutes: React.FC = () => {
    return (
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/auth/login" replace />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
  
        {/* Admin Routes */}
        <Route element={<PrivateRoute allowedRoles={['admin']} />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
         {/* <Route path="/admin/sellers" element={<SellersList />} />
         <Route path="/admin/products" element={<AdminProductsList />} />  */}
        
      </Route>

      {/* Seller Routes */}
      <Route element={<PrivateRoute allowedRoles={['seller']} />}>
         <Route path="/seller/dashboard" element={<SellerDashboard />} />
        {/* <Route path="/seller/products" element={<SellerProducts />} />  */}
      </Route>

      {/* Customer Routes */}
      <Route element={<PrivateRoute allowedRoles={['customer']} />}>
         <Route path="/customer/dashboard" element={<CustomerDashboard />} />
        {/* <Route path="/customer/products" element={<CustomerProductsList />} />
        <Route path="/customer/cart" element={<Cart />} /> */}
      </Route>

      {/* Catch all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
