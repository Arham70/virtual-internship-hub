import React from 'react';
import { GraduationCapIcon, BriefcaseIcon } from '../ui';
import { ROLE } from '../../utilities/constants';

/**
 * Two buttons: Student or Mentor. Used on signup form.
 */
function RoleSwitcher({ role, onRoleChange }) {
  return (
    <div>
      <span className="block text-gray-700 text-sm font-medium mb-2">I am a</span>
      <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-lg">
        <button
          type="button"
          onClick={() => onRoleChange(ROLE.STUDENT)}
          className={
            'flex items-center justify-center gap-2 py-3 px-4 rounded-lg transition-all ' +
            (role === ROLE.STUDENT ? 'bg-white text-teal-600 shadow-sm' : 'text-gray-600 hover:text-gray-900')
          }
        >
          <GraduationCapIcon className="w-5 h-5" />
          Student
        </button>
        <button
          type="button"
          onClick={() => onRoleChange(ROLE.MENTOR)}
          className={
            'flex items-center justify-center gap-2 py-3 px-4 rounded-lg transition-all ' +
            (role === ROLE.MENTOR ? 'bg-white text-violet-600 shadow-sm' : 'text-gray-600 hover:text-gray-900')
          }
        >
          <BriefcaseIcon className="w-5 h-5" />
          Mentor
        </button>
      </div>
    </div>
  );
}

export default RoleSwitcher;
