import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import 'antd/dist/reset.css'; // Import Antd CSS reset
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(

    <BrowserRouter>
      <App />
    </BrowserRouter>

);
