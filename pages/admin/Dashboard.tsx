import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Home,
  Users,
  Settings,
  LogOut,
} from 'lucide-react'; // Icons from lucide-react

const Dashboard = () => {
  const navigate = useNavigate();

  const navItems = [
    { label: 'Dashboard', icon: <Home size={20} />, route: '/admin/dashboard' },
    { label: 'Users', icon: <Users size={20} />, route: '/admin/users' },
    { label: 'Settings', icon: <Settings size={20} />, route: '/admin/settings' },
    { label: 'Logout', icon: <LogOut size={20} />, route: '/logout' },
  ];

  const handleNavigation = (route: string) => {
    navigate(route);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Main content */}
      <div className="flex-1 p-4 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-4">Welcome to Admin Dashboard</h1>
        <p>This is where you manage admin tasks.</p>
        {/* You can add cards, tables, analytics here */}
      </div>

      {/* Footer Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-md flex justify-around items-center py-3">
        {navItems.map((item) => (
          <button
            key={item.label}
            onClick={() => handleNavigation(item.route)}
            className="flex flex-col items-center text-sm text-gray-600 hover:text-blue-600"
          >
            {item.icon}
            <span className="mt-1">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
