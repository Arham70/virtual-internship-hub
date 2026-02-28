/**
 * Auth page theme per role – matches dashboard colors.
 * Student = teal (student dashboard), Mentor = violet/purple (mentor dashboard), Admin = gray.
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

/** Tailwind classes and copy per variant – aligned with Student (teal) and Mentor (violet) dashboards */
export const authTheme = {
  student: {
    pageBg: 'min-h-screen flex bg-gradient-to-br from-slate-50 via-teal-50/80 to-slate-100',
    panelBg: 'bg-gradient-to-br from-teal-800 via-teal-700 to-teal-600',
    cardShadow: 'shadow-xl shadow-teal-500/10',
    logoGradient: 'from-teal-700 to-teal-600',
    accent: 'teal',
    portalName: 'Student Portal',
    tagline: 'Learn • Build • Succeed',
    accentClass: 'text-teal-600 hover:text-teal-700',
    buttonClass: 'bg-teal-600 hover:bg-teal-700 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2',
    stats: [
      { value: '10K+', label: 'Active Students' },
      { value: '1000+', label: 'Projects' },
      { value: '95%', label: 'Success Rate' },
    ],
  },
  mentor: {
    pageBg: 'min-h-screen flex bg-gradient-to-br from-slate-50 via-violet-50/80 to-purple-50/80',
    panelBg: 'bg-gradient-to-br from-violet-800 via-purple-600 to-violet-500',
    cardShadow: 'shadow-2xl shadow-violet-500/10',
    logoGradient: 'from-violet-700 to-purple-600',
    accent: 'violet',
    portalName: 'Mentor Portal',
    tagline: 'Guide • Inspire • Transform',
    accentClass: 'text-violet-600 hover:text-violet-700',
    buttonClass: 'bg-violet-700 hover:bg-purple-600 focus:ring-2 focus:ring-violet-500 focus:ring-offset-2',
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
