import React from 'react';
import { GraduationCapIcon } from './Icons';
import AuthLeftPanel from './AuthLeftPanel';

/**
 * Wraps the whole auth screen: left panel (branding) + right panel (form card).
 * Children = content inside the white card (title, error, form).
 */
function AuthLayout({ leftTitle, leftSubtitle, cardTitle, cardSubtitle, errorMessage, children }) {
  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <AuthLeftPanel title={leftTitle} subtitle={leftSubtitle} />

      {/* Right side: form card */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 overflow-y-auto">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-2xl shadow-blue-500/10 border border-gray-100 p-8">
            {/* Logo on mobile only */}
            <div className="lg:hidden mb-6 flex items-center justify-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                <GraduationCapIcon className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-semibold text-gray-900">Virtual Internship Hub</span>
            </div>

            {/* Card title and subtitle */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">{cardTitle}</h2>
              <p className="text-gray-600 mt-1">{cardSubtitle}</p>
            </div>

            {/* Error message (if any) */}
            {errorMessage && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-700">
                <span className="text-lg">⚠</span>
                <p className="text-sm">{errorMessage}</p>
              </div>
            )}

            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
