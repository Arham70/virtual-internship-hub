import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Shown when user tries to access a page they don't have permission for (403).
 */
function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">403 - Unauthorized</h1>
        <p className="text-gray-600 mb-6">You don't have permission to access this page.</p>
        <Link
          to="/dashboard"
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}

export default UnauthorizedPage;
