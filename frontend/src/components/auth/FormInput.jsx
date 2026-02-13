import React from 'react';

/**
 * One form field: label + optional icon + input.
 * Use this so all auth inputs look the same.
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
}) {
  const inputClass =
    'w-full pr-3 py-2.5 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition disabled:opacity-50 ' +
    (Icon ? 'pl-10 ' : 'px-3 ') +
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
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          minLength={minLength}
          className={inputClass}
        />
      </div>
    </div>
  );
}

export default FormInput;
