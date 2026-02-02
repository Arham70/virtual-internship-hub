import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    password_confirm: '',
    role: 'STUDENT',
    first_name: '',
    last_name: '',
    target_domain: '',
    current_skill_level: '',
    professional_bio: '',
    expertise_area: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.username) newErrors.username = 'Username is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (formData.password !== formData.password_confirm) {
      newErrors.password_confirm = 'Passwords do not match';
    }
    
    if (formData.role === 'STUDENT') {
      if (!formData.first_name) newErrors.first_name = 'First name is required';
      if (!formData.last_name) newErrors.last_name = 'Last name is required';
    } else if (formData.role === 'MENTOR') {
      if (!formData.professional_bio) newErrors.professional_bio = 'Professional bio is required';
      if (!formData.expertise_area) newErrors.expertise_area = 'Expertise area is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setErrors({});
    
    const registrationData = {
      email: formData.email,
      username: formData.username,
      password: formData.password,
      password_confirm: formData.password_confirm,
      role: formData.role,
    };
    
    if (formData.role === 'STUDENT') {
      registrationData.first_name = formData.first_name;
      registrationData.last_name = formData.last_name;
      if (formData.target_domain) registrationData.target_domain = formData.target_domain;
      if (formData.current_skill_level) registrationData.current_skill_level = formData.current_skill_level;
    } else if (formData.role === 'MENTOR') {
      registrationData.professional_bio = formData.professional_bio;
      registrationData.expertise_area = formData.expertise_area;
    }
    
    const result = await register(registrationData);
    setLoading(false);
    
    if (result.success) {
      const role = result.user.role;
      if (role === 'STUDENT') {
        navigate('/student/dashboard');
      } else if (role === 'MENTOR') {
        navigate('/mentor/dashboard');
      } else if (role === 'ADMINISTRATOR') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } else {
      if (result.error) {
        if (typeof result.error === 'string') {
          setErrors({ general: result.error });
        } else if (result.error.non_field_errors) {
          setErrors({ general: result.error.non_field_errors[0] });
        } else {
          setErrors(result.error);
        }
      } else {
        setErrors({ general: 'Registration failed. Please try again.' });
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          {errors.general && (
            <div className="error-message">{errors.general}</div>
          )}
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
            {errors.email && <span className="error">{Array.isArray(errors.email) ? errors.email[0] : errors.email}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Choose a username"
            />
            {errors.username && <span className="error">{Array.isArray(errors.username) ? errors.username[0] : errors.username}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="role">Role</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="STUDENT">Student</option>
              <option value="MENTOR">Mentor</option>
              <option value="ADMINISTRATOR">Administrator</option>
            </select>
          </div>
          
          {formData.role === 'STUDENT' && (
            <>
              <div className="form-group">
                <label htmlFor="first_name">First Name</label>
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                  placeholder="Enter your first name"
                />
                {errors.first_name && <span className="error">{Array.isArray(errors.first_name) ? errors.first_name[0] : errors.first_name}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="last_name">Last Name</label>
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                  placeholder="Enter your last name"
                />
                {errors.last_name && <span className="error">{Array.isArray(errors.last_name) ? errors.last_name[0] : errors.last_name}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="target_domain">Target Domain (Optional)</label>
                <select
                  id="target_domain"
                  name="target_domain"
                  value={formData.target_domain}
                  onChange={handleChange}
                >
                  <option value="">Select a domain</option>
                  <option value="GRAPHIC_DESIGN">Graphic Design</option>
                  <option value="CONTENT_WRITING">Content Writing</option>
                  <option value="PROGRAMMING">Programming</option>
                  <option value="FREELANCING">Freelancing</option>
                  <option value="E_COMMERCE">E-Commerce</option>
                  <option value="QUICKBOOKS">QuickBooks</option>
                  <option value="AUTOCAD">AutoCAD</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="current_skill_level">Current Skill Level (Optional)</label>
                <select
                  id="current_skill_level"
                  name="current_skill_level"
                  value={formData.current_skill_level}
                  onChange={handleChange}
                >
                  <option value="">Select skill level</option>
                  <option value="BEGINNER">Beginner</option>
                  <option value="INTERMEDIATE">Intermediate</option>
                  <option value="ADVANCED">Advanced</option>
                  <option value="EXPERT">Expert</option>
                </select>
              </div>
            </>
          )}
          
          {formData.role === 'MENTOR' && (
            <>
              <div className="form-group">
                <label htmlFor="professional_bio">Professional Bio</label>
                <textarea
                  id="professional_bio"
                  name="professional_bio"
                  value={formData.professional_bio}
                  onChange={handleChange}
                  required
                  rows="4"
                  placeholder="Tell us about your professional background"
                />
                {errors.professional_bio && <span className="error">{Array.isArray(errors.professional_bio) ? errors.professional_bio[0] : errors.professional_bio}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="expertise_area">Expertise Area</label>
                <input
                  type="text"
                  id="expertise_area"
                  name="expertise_area"
                  value={formData.expertise_area}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Web Development, Graphic Design"
                />
                {errors.expertise_area && <span className="error">{Array.isArray(errors.expertise_area) ? errors.expertise_area[0] : errors.expertise_area}</span>}
              </div>
            </>
          )}
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password (min 8 characters)"
            />
            {errors.password && <span className="error">{Array.isArray(errors.password) ? errors.password[0] : errors.password}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="password_confirm">Confirm Password</label>
            <input
              type="password"
              id="password_confirm"
              name="password_confirm"
              value={formData.password_confirm}
              onChange={handleChange}
              required
              placeholder="Confirm your password"
            />
            {errors.password_confirm && <span className="error">{Array.isArray(errors.password_confirm) ? errors.password_confirm[0] : errors.password_confirm}</span>}
          </div>
          
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
          
          <p className="auth-link">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;

