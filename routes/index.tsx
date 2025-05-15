import React from 'react';
import { Navigate, Route, Routes, Outlet } from 'react-router-dom';

// Pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';

// import AdminDashboard from '../pages/admin/Dashboard';
// import SellersList from '../pages/admin/SellersList';
// import AdminProductsList from '../pages/admin/ProductsList';

// import SellerDashboard from '../pages/seller/Dashboard';
// import SellerProducts from '../pages/seller/SellerProducts';

// import CustomerDashboard from '../pages/customer/Dashboard';
// import CustomerProductsList from '../pages/customer/ProductsList';
// import Cart from '../pages/customer/Cart';

import NotFound from '../pages/NotFound';

// Dummy auth & role check - Replace with actual auth logic
const getUserRole = (): 'admin' | 'seller' | 'customer' | null => {
  // E.g., get from localStorage or context
  return localStorage.getItem('userRole') as any || null;
};

const PrivateRoute: React.FC<{ allowedRoles: string[] }> = ({ allowedRoles }) => {
  const role = getUserRole();

  if (!role) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(role)) {
    // Unauthorized access
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Admin Routes */}
      <Route element={<PrivateRoute allowedRoles={['admin']} />}>
        {/* <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/sellers" element={<SellersList />} />
        <Route path="/admin/products" element={<AdminProductsList />} /> */}
      </Route>

      {/* Seller Routes */}
      <Route element={<PrivateRoute allowedRoles={['seller']} />}>
        {/* <Route path="/seller/dashboard" element={<SellerDashboard />} />
        <Route path="/seller/products" element={<SellerProducts />} /> */}
      </Route>

      {/* Customer Routes */}
      <Route element={<PrivateRoute allowedRoles={['customer']} />}>
        {/* <Route path="/customer/dashboard" element={<CustomerDashboard />} />
        <Route path="/customer/products" element={<CustomerProductsList />} />
        <Route path="/customer/cart" element={<Cart />} /> */}
      </Route>

      {/* Catch all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
