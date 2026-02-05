import React from 'react';
import { useAuth } from '../../context/AuthContext';
import './Dashboard.css';

const StudentDashboard = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    window.location.href = '/login';
  };

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <h1>Student Dashboard</h1>
        <button onClick={handleLogout} className="btn-logout">Logout</button>
      </nav>
      
      <div className="dashboard-content">
        <div className="welcome-card">
          <h2>Welcome, {user?.student_profile?.first_name || user?.username}!</h2>
          <p>Role: {user?.role}</p>
        </div>
        
        <div className="info-cards">
          <div className="info-card">
            <h3>Profile Information</h3>
            <p><strong>Name:</strong> {user?.student_profile?.first_name} {user?.student_profile?.last_name}</p>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Target Domains:</strong> {
              user?.student_profile?.target_domains?.length > 0
                ? user.student_profile.target_domains.map(d => d.name).join(', ')
                : 'Not set'
            }</p>
            <p><strong>Skill Level:</strong> {user?.student_profile?.current_skill_level || 'Not set'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;

