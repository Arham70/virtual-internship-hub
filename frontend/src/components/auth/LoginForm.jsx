import React from 'react';
import { FormInput, MailIcon, LockIcon, Loader2Icon } from '../ui';

/**
 * Login form: email, password, forgot link, submit.
 * hideSignupLink: hide "Don't have an account? Sign up" (e.g. admin page).
 * hideAdminLink: hide "Admin login" link (e.g. on role-specific pages).
 * accentClass: for Forgot password and Sign up link (e.g. text-blue-600, text-gray-900).
 */
function LoginForm({
  email,
  password,
  loading,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  onForgotPassword,
  onSwitchToSignup,
  hideSignupLink,
  hideAdminLink,
  accentClass = 'text-blue-600 hover:text-blue-700',
  buttonClass = 'bg-blue-600 hover:bg-blue-700',
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <FormInput
        id="login-email"
        label="Email"
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => onEmailChange(e.target.value)}
        required
        disabled={loading}
        icon={MailIcon}
      />
      <FormInput
        id="login-password"
        label="Password"
        type="password"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => onPasswordChange(e.target.value)}
        required
        disabled={loading}
        icon={LockIcon}
        showPasswordToggle
      />

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm text-gray-600">
          <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" disabled={loading} />
          Remember me
        </label>
        <button type="button" className={`text-sm ${accentClass}`} disabled={loading} onClick={onForgotPassword}>
          Forgot password?
        </button>
      </div>

      <button
        type="submit"
        className={`w-full py-3 rounded-lg ${buttonClass} text-white font-medium disabled:opacity-70 flex items-center justify-center gap-2`}
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2Icon className="w-4 h-4 animate-spin" />
            Signing in...
          </>
        ) : (
          'Log in'
        )}
      </button>

      {!hideSignupLink && onSwitchToSignup && (
        <p className="text-center text-gray-600 text-sm">
          Don't have an account?{' '}
          <button type="button" className={`font-medium ${accentClass}`} onClick={onSwitchToSignup}>
            Sign up
          </button>
        </p>
      )}
    </form>
  );
}

export default LoginForm;
