import React from 'react';
import { useAuth } from '../../context/AuthContext';
import './Dashboard.css';

const MentorDashboard = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    window.location.href = '/login';
  };

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <h1>Mentor Dashboard</h1>
        <button onClick={handleLogout} className="btn-logout">Logout</button>
      </nav>
      
      <div className="dashboard-content">
        <div className="welcome-card">
          <h2>Welcome, {user?.username}!</h2>
          <p>Role: {user?.role}</p>
        </div>
        
        <div className="info-cards">
          <div className="info-card">
            <h3>Profile Information</h3>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Expertise:</strong> {user?.mentor_profile?.expertise_area || 'Not set'}</p>
            <p><strong>Experience:</strong> {user?.mentor_profile?.years_of_experience || 0} years</p>
            <p><strong>Available:</strong> {user?.mentor_profile?.is_available ? 'Yes' : 'No'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorDashboard;

