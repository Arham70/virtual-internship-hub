import React from 'react';
import { GraduationCapIcon, BriefcaseIcon, UserIcon } from './Icons';

/**
 * Left side of auth screen: logo, headline, feature cards, stats.
 * Shown only on large screens (hidden on mobile).
 */
function AuthLeftPanel({ title, subtitle }) {
  const features = [
    { icon: BriefcaseIcon, title: 'Real Projects', subtitle: 'Hands-on experience' },
    { icon: UserIcon, title: 'Expert Mentors', subtitle: 'Industry leaders' },
    { icon: GraduationCapIcon, title: 'Career Growth', subtitle: 'Launch your future' },
  ];

  return (
    <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 overflow-hidden">
      {/* Soft blur for depth */}
      <div className="absolute inset-0 opacity-10 bg-white rounded-full blur-3xl w-96 h-96 -top-24 -left-24" />

      <div className="absolute inset-0 flex flex-col justify-between p-10 text-white">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
            <GraduationCapIcon className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl tracking-tight font-semibold">Virtual Internship Hub</h1>
            <p className="text-blue-100 text-sm">Learn • Connect • Grow</p>
          </div>
        </div>

        {/* Headline - changes by login/signup/forgot */}
        <div className="space-y-6">
          <div>
            <h2 className="text-4xl lg:text-5xl leading-tight max-w-lg font-bold">{title}</h2>
            <p className="text-xl text-blue-100 max-w-md mt-3">{subtitle}</p>
          </div>

          {/* Feature cards */}
          <div className="grid grid-cols-3 gap-3 max-w-xl">
            {features.map((item) => {
              const Icon = item.icon;
              return (
              <div
                key={item.title}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
              >
                <div className="w-10 h-10 rounded-lg bg-blue-500/30 flex items-center justify-center mb-2">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-medium">{item.title}</h3>
                <p className="text-xs text-blue-100">{item.subtitle}</p>
              </div>
              );
            })}
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-8 text-white">
          <div>
            <div className="text-3xl font-semibold">10K+</div>
            <div className="text-sm text-blue-100">Active Students</div>
          </div>
          <div>
            <div className="text-3xl font-semibold">500+</div>
            <div className="text-sm text-blue-100">Industry Mentors</div>
          </div>
          <div>
            <div className="text-3xl font-semibold">95%</div>
            <div className="text-sm text-blue-100">Success Rate</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthLeftPanel;
