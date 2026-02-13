/**
 * App.jsx – Root component and routes.
 * Auth loads first (fast); dashboards load on demand (lazy) for fast initial load.
 */
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthPage, ProtectedRoute } from './components/auth';

const StudentDashboard = lazy(() => import('./components/dashboard/StudentDashboard'));
const MentorDashboard = lazy(() => import('./components/dashboard/MentorDashboard'));
const AdminDashboard = lazy(() => import('./components/dashboard/AdminDashboard'));
const UnauthorizedPage = lazy(() => import('./components/UnauthorizedPage'));

function PageFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <p className="text-gray-600">Loading...</p>
    </div>
  );
}

function AppRoutes() {
  const { isAuthenticated, user } = useAuth();

  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <AuthPage />}
        />
        <Route
          path="/register"
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <AuthPage />}
        />
        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mentor/dashboard"
          element={
            <ProtectedRoute allowedRoles={['MENTOR']}>
              <MentorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={['ADMINISTRATOR']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              {user?.role === 'STUDENT' && <Navigate to="/student/dashboard" replace />}
              {user?.role === 'MENTOR' && <Navigate to="/mentor/dashboard" replace />}
              {user?.role === 'ADMINISTRATOR' && <Navigate to="/admin/dashboard" replace />}
              {!user && <Navigate to="/login" replace />}
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
      </Routes>
    </Suspense>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;


