/**
 * Auth page theme per role (Figma: Student = blue/indigo, Mentor = purple/pink, Admin = gray).
 * Used by AuthLayout and AuthLeftPanel for variant-based styling.
 */
import { ROLE } from './constants';

export const AUTH_VARIANT = {
  STUDENT: 'student',
  MENTOR: 'mentor',
  ADMIN: 'admin',
};

export function getAuthVariantFromRole(role) {
  if (role === ROLE.ADMINISTRATOR) return AUTH_VARIANT.ADMIN;
  if (role === ROLE.MENTOR) return AUTH_VARIANT.MENTOR;
  return AUTH_VARIANT.STUDENT;
}

/** Tailwind classes and copy per variant */
export const authTheme = {
  student: {
    pageBg: 'min-h-screen flex bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50',
    panelBg: 'bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800',
    cardShadow: 'shadow-2xl shadow-blue-500/10',
    logoGradient: 'from-blue-600 to-indigo-600',
    accent: 'blue',
    portalName: 'Student Portal',
    tagline: 'Learn • Build • Succeed',
    accentClass: 'text-blue-600 hover:text-blue-700',
    buttonClass: 'bg-blue-600 hover:bg-blue-700',
    stats: [
      { value: '10K+', label: 'Active Students' },
      { value: '1000+', label: 'Projects' },
      { value: '95%', label: 'Success Rate' },
    ],
  },
  mentor: {
    pageBg: 'min-h-screen flex bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50',
    panelBg: 'bg-gradient-to-br from-purple-600 via-pink-600 to-rose-700',
    cardShadow: 'shadow-2xl shadow-purple-500/10',
    logoGradient: 'from-purple-600 to-pink-600',
    accent: 'purple',
    portalName: 'Mentor Portal',
    tagline: 'Guide • Inspire • Transform',
    accentClass: 'text-purple-600 hover:text-purple-700',
    buttonClass: 'bg-purple-600 hover:bg-purple-700',
    stats: [
      { value: '500+', label: 'Active Mentors' },
      { value: '5000+', label: 'Students Mentored' },
      { value: '4.8/5', label: 'Avg Rating' },
    ],
  },
  admin: {
    pageBg: 'min-h-screen flex bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50',
    panelBg: 'bg-gradient-to-br from-gray-900 via-zinc-800 to-slate-900',
    cardShadow: 'shadow-2xl shadow-gray-500/10',
    logoGradient: 'from-gray-900 to-zinc-800',
    accent: 'gray',
    portalName: 'Admin Portal',
    tagline: 'Secure • Control • Monitor',
    accentClass: 'text-gray-900 hover:text-gray-700',
    buttonClass: 'bg-gray-900 hover:bg-gray-800',
    stats: [
      { value: '99.9%', label: 'Uptime' },
      { value: '10K+', label: 'Users Managed' },
      { value: '24/7', label: 'Monitoring' },
    ],
  },
};
