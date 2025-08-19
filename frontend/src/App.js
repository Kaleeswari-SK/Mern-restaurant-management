import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LoginPage from './components/LoginPage';
import RegistrationPage from './components/RegistrationPage';
import AdminDashboard from './components/AdminDashboard';
import HomePage from './components/HomePage';
import NotFound from './components/NotFound';
import Menu from "./components/Menu";
import OrderOnline from "./components/OrderOnline";
import Feedback from './components/Feedback'; // ✅ Add this line here

function App() {
  return (
    <Router>
      <header style={{
  width: '100%',
  backgroundColor: 'orangered',
  color: 'white',
  padding: '1rem 0',
  textAlign: 'center',
  fontSize: '2rem',
  fontWeight: 'bold'
}}>
  Flavour Fusion
</header>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/order-online" element={<OrderOnline />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/feedback" element={<Feedback />} />
      </Routes>
    </Router>
  );
}

export default App;
