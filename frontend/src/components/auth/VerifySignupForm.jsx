import React from 'react';
import { OTPInput, Loader2Icon, ArrowLeftIcon } from '../ui';

/**
 * Signup step 2: Enter 6-digit OTP sent to email. Verify creates the account.
 */
function VerifySignupForm({
  email,
  otp,
  loading,
  onOtpChange,
  onVerify,
  onResend,
  onBackToForm,
  accentClass,
  buttonClass,
}) {
  return (
    <form onSubmit={onVerify} className="space-y-5">
      <p className="text-sm text-gray-600 text-center">
        We sent a 6-digit code to <strong>{email}</strong>. Enter it below to create your account.
      </p>
      <OTPInput value={otp} onChange={onOtpChange} disabled={loading} />
      <button
        type="submit"
        className={`w-full py-3 rounded-lg text-white font-medium disabled:opacity-70 flex items-center justify-center gap-2 ${buttonClass || 'bg-blue-600 hover:bg-blue-700'}`}
        disabled={loading || otp.length !== 6}
      >
        {loading ? (
          <>
            <Loader2Icon className="w-4 h-4 animate-spin" />
            Verifying...
          </>
        ) : (
          'Verify & Create Account'
        )}
      </button>
      <p className="text-center text-sm text-gray-600">
        <button type="button" className={`${accentClass || 'text-blue-600 hover:text-blue-700'}`} onClick={onResend} disabled={loading}>
          Resend code
        </button>
        {' · '}
        <button type="button" className={`${accentClass || 'text-blue-600 hover:text-blue-700'} inline-flex items-center gap-1`} onClick={onBackToForm}>
          <ArrowLeftIcon className="w-4 h-4 inline" />
          Back
        </button>
      </p>
    </form>
  );
}

export default VerifySignupForm;
