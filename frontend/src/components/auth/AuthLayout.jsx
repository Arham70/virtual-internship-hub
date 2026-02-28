import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCapIcon, BriefcaseIcon, ShieldIcon, ArrowLeftIcon } from '../ui';
import { authTheme } from '../../utilities/authThemes';
import AuthLeftPanel from './AuthLeftPanel';

const variantIcons = {
  student: GraduationCapIcon,
  mentor: BriefcaseIcon,
  admin: ShieldIcon,
};

/**
 * Wraps the whole auth screen: left panel (branding) + right panel (form card).
 * variant = 'student' | 'mentor' | 'admin' for theme (Figma: blue, purple, gray).
 */
function AuthLayout({ variant = 'student', leftTitle, leftSubtitle, cardTitle, cardSubtitle, errorMessage, successMessage, showBackToHome = true, children }) {
  const theme = authTheme[variant] || authTheme.student;
  const Icon = variantIcons[variant] || GraduationCapIcon;

  return (
    <div className={theme.pageBg}>
      <AuthLeftPanel variant={variant} title={leftTitle} subtitle={leftSubtitle} />

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 overflow-y-auto">
        <div className="w-full max-w-md">
          <div className={`auth-card auth-card--${variant} bg-white rounded-2xl border border-gray-200/80 p-8 shadow-xl ${theme.cardShadow}`}>
            {/* Back to Home */}
            {showBackToHome && (
              <Link to="/" className="mb-6 text-gray-600 hover:text-gray-900 inline-flex items-center gap-2 transition-colors">
                <ArrowLeftIcon className="w-4 h-4" />
                Back to Home
              </Link>
            )}

            {/* Logo on mobile only */}
            <div className="lg:hidden mb-6 flex items-center justify-center gap-2">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${theme.logoGradient} flex items-center justify-center`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-semibold text-gray-900">{theme.portalName}</span>
            </div>

            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">{cardTitle}</h2>
              <p className="text-gray-600 mt-1">{cardSubtitle}</p>
            </div>

            {successMessage && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3 text-green-800">
                <span className="text-lg">✓</span>
                <p className="text-sm">{successMessage}</p>
              </div>
            )}

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
