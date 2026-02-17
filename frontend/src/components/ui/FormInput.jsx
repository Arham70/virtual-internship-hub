import React, { useState } from 'react';
import { EyeIcon, EyeOffIcon } from './Icons';

/**
 * Reusable form field: label + optional icon + input.
 * When type="password" and showPasswordToggle=true, shows an eye icon to reveal/hide password.
 */
function FormInput({
  id,
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  required = false,
  disabled = false,
  minLength,
  icon: Icon,
  className = '',
  showPasswordToggle = false,
}) {
  const [visible, setVisible] = useState(false);
  const isPassword = type === 'password';
  const showToggle = isPassword && showPasswordToggle;
  const inputType = showToggle && visible ? 'text' : type;

  const inputClass =
    'w-full py-2.5 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition disabled:opacity-50 ' +
    (Icon ? 'pl-10 ' : 'px-3 ') +
    (showToggle ? 'pr-10 ' : 'pr-3 ') +
    className;

  return (
    <div>
      {label && (
        <label htmlFor={id} className="block text-gray-700 text-sm font-medium mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Icon className="w-5 h-5" />
          </span>
        )}
        <input
          id={id}
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          minLength={minLength}
          className={inputClass}
        />
        {showToggle && (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setVisible((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
            aria-label={visible ? 'Hide password' : 'Show password'}
          >
            {visible ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
          </button>
        )}
      </div>
    </div>
  );
}

export default FormInput;
