import React from 'react';
import AppRoutes from './routes';
import { useTokenRefresher } from "./hooks/useTokenRefresher";

const App: React.FC = () => {
  useTokenRefresher();
  return <AppRoutes />;
};

export default App;
