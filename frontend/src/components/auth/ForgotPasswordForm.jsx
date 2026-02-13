import React from 'react';
import FormInput from './FormInput';
import { MailIcon, LockIcon, Loader2Icon, ArrowLeftIcon } from './Icons';
import { OTPInput } from './OTPInput';
import { FORGOT_STEP } from './constants';

/**
 * Forgot password: 3 steps.
 * Step 1: enter email → Step 2: enter OTP → Step 3: new password + confirm.
 */
function ForgotPasswordForm({
  step,
  email,
  otp,
  newPassword,
  confirmPassword,
  loading,
  onEmailChange,
  onOtpChange,
  onNewPasswordChange,
  onConfirmPasswordChange,
  onSendOtp,
  onVerifyOtp,
  onResetPassword,
  onResendOtp,
  onBackToEmail,
  onBackToOtp,
  onBackToLogin,
}) {
  // Step 1: Enter email
  if (step === FORGOT_STEP.EMAIL) {
    return (
      <form onSubmit={onSendOtp} className="space-y-5">
        <FormInput
          id="forgot-email"
          label="Email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          required
          disabled={loading}
          icon={MailIcon}
        />
        <button
          type="submit"
          className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium disabled:opacity-70 flex items-center justify-center gap-2"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2Icon className="w-4 h-4 animate-spin" />
              Sending...
            </>
          ) : (
            'Send OTP'
          )}
        </button>
        <p className="text-center text-sm text-gray-600">
          Remember your password?{' '}
          <button type="button" className="text-blue-600 hover:text-blue-700" onClick={onBackToLogin}>
            Log in
          </button>
        </p>
      </form>
    );
  }

  // Step 2: Enter OTP (OTP expires in 2 min; user can resend)
  if (step === FORGOT_STEP.OTP) {
    return (
      <form onSubmit={onVerifyOtp} className="space-y-5">
        <p className="text-sm text-gray-600 text-center">We sent a 6-digit code to {email}. It expires in 2 minutes.</p>
        <OTPInput value={otp} onChange={onOtpChange} disabled={loading} />
        <button
          type="submit"
          className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium disabled:opacity-70 flex items-center justify-center gap-2"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2Icon className="w-4 h-4 animate-spin" />
              Verifying...
            </>
          ) : (
            'Verify OTP'
          )}
        </button>
        <p className="text-center text-sm text-gray-600">
          <button type="button" className="text-blue-600 hover:text-blue-700" onClick={onResendOtp} disabled={loading}>
            Resend OTP
          </button>
          {' · '}
          <button type="button" className="text-blue-600 hover:text-blue-700 inline-flex items-center gap-1" onClick={onBackToEmail}>
            <ArrowLeftIcon className="w-4 h-4 inline" />
            Back
          </button>
        </p>
      </form>
    );
  }

  // Step 3: New password
  return (
    <form onSubmit={onResetPassword} className="space-y-5">
      <FormInput
        id="new-password"
        label="New Password"
        type="password"
        placeholder="Create a strong password (min 8 characters)"
        value={newPassword}
        onChange={(e) => onNewPasswordChange(e.target.value)}
        required
        disabled={loading}
        minLength={8}
        icon={LockIcon}
      />
      <FormInput
        id="confirm-password"
        label="Confirm Password"
        type="password"
        placeholder="Confirm your password"
        value={confirmPassword}
        onChange={(e) => onConfirmPasswordChange(e.target.value)}
        required
        disabled={loading}
        icon={LockIcon}
      />
      <button
        type="submit"
        className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium disabled:opacity-70 flex items-center justify-center gap-2"
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2Icon className="w-4 h-4 animate-spin" />
            Resetting...
          </>
        ) : (
          'Reset Password'
        )}
      </button>
      <p className="text-center">
        <button type="button" className="text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 text-sm" onClick={onBackToOtp}>
          <ArrowLeftIcon className="w-4 h-4" />
          Back
        </button>
      </p>
    </form>
  );
}

export default ForgotPasswordForm;
