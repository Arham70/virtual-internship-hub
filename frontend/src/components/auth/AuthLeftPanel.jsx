import React from 'react';
import { GraduationCapIcon, BriefcaseIcon, UserIcon, ShieldIcon } from '../ui';
import { authTheme } from '../../utilities/authThemes';

const variantIcons = {
  student: GraduationCapIcon,
  mentor: BriefcaseIcon,
  admin: ShieldIcon,
};

const features = [
  { icon: BriefcaseIcon, title: 'Real Projects', subtitle: 'Hands-on experience' },
  { icon: UserIcon, title: 'Expert Mentors', subtitle: 'Industry leaders' },
  { icon: GraduationCapIcon, title: 'Career Growth', subtitle: 'Launch your future' },
];

/**
 * Left side of auth screen: logo, headline, stats. Theme by variant (student/mentor/admin).
 */
function AuthLeftPanel({ variant = 'student', title, subtitle }) {
  const theme = authTheme[variant] || authTheme.student;
  const Icon = variantIcons[variant] || GraduationCapIcon;
  const textMuted = variant === 'admin' ? 'text-gray-300' : variant === 'mentor' ? 'text-violet-100' : 'text-teal-100';

  return (
    <div className={`hidden lg:flex lg:w-1/2 relative overflow-hidden ${theme.panelBg}`}>
      <div className="absolute inset-0 opacity-10 bg-white rounded-full blur-3xl w-96 h-96 -top-24 -left-24" />

      <div className="absolute inset-0 flex flex-col justify-between p-10 text-white">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
            <Icon className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl tracking-tight font-semibold">{theme.portalName}</h1>
            <p className={`text-sm ${variant === 'admin' ? 'text-gray-400' : variant === 'mentor' ? 'text-violet-100' : 'text-teal-100'}`}>{theme.tagline}</p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-4xl lg:text-5xl leading-tight max-w-lg font-bold">{title}</h2>
            <p className={`text-xl max-w-md mt-3 ${textMuted}`}>{subtitle}</p>
          </div>

          {variant !== 'admin' && (
            <div className="grid grid-cols-3 gap-3 max-w-xl">
              {features.map((item) => {
                const FIcon = item.icon;
                return (
                  <div key={item.title} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center mb-2">
                      <FIcon className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm font-medium">{item.title}</h3>
                    <p className={`text-xs ${textMuted}`}>{item.subtitle}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex gap-8 text-white">
          {theme.stats.map((s) => (
            <div key={s.label}>
              <div className="text-3xl font-semibold">{s.value}</div>
              <div className={`text-sm ${textMuted}`}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AuthLeftPanel;
