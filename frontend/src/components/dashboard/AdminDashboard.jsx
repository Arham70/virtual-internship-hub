import React from 'react';
import { useAuth } from '../../context/AuthContext';
import './Dashboard.css';

const AdminDashboard = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    window.location.href = '/login';
  };

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <h1>Admin Dashboard</h1>
        <button onClick={handleLogout} className="btn-logout">Logout</button>
      </nav>
      
      <div className="dashboard-content">
        <div className="welcome-card">
          <h2>Welcome, {user?.username}!</h2>
          <p>Role: {user?.role}</p>
        </div>
        
        <div className="info-cards">
          <div className="info-card">
            <h3>Administrator Panel</h3>
            <p>Manage users, tasks, and system settings from here.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

