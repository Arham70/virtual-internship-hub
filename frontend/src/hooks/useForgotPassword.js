import { useState, useCallback } from 'react';
import { authApi } from '../api/auth.api';
import {
  buildSendOtpPayload,
  buildVerifyOtpPayload,
  buildResetPasswordPayload,
  buildResendOtpPayload,
} from '../services/auth.service';

/**
 * Hook: forgot password flow (send OTP, verify OTP, reset password, resend OTP).
 * Returns handlers and { loading, error }. Callers set error state from returned error.
 */
export function useForgotPassword() {
  const [loading, setLoading] = useState(false);

  const sendOtp = useCallback(async (email) => {
    setLoading(true);
    try {
      await authApi.sendPasswordResetOtp(buildSendOtpPayload(email));
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.email?.[0] || err.response?.data?.detail || 'Failed to send OTP.',
      };
    } finally {
      setLoading(false);
    }
  }, []);

  const verifyOtp = useCallback(async (email, otp) => {
    setLoading(true);
    try {
      await authApi.verifyPasswordResetOtp(buildVerifyOtpPayload(email, otp));
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.otp?.[0] || err.response?.data?.detail || 'Invalid or expired OTP.',
      };
    } finally {
      setLoading(false);
    }
  }, []);

  const resetPassword = useCallback(async (email, otp, newPassword, newPasswordConfirm) => {
    setLoading(true);
    try {
      await authApi.resetPassword(
        buildResetPasswordPayload(email, otp, newPassword, newPasswordConfirm)
      );
      return { success: true };
    } catch (err) {
      const msg =
        err.response?.data?.new_password?.[0] ??
        err.response?.data?.otp?.[0] ??
        err.response?.data?.detail ??
        'Failed to reset password.';
      return { success: false, error: Array.isArray(msg) ? msg[0] : msg };
    } finally {
      setLoading(false);
    }
  }, []);

  const resendOtp = useCallback(async (email) => {
    setLoading(true);
    try {
      await authApi.resendPasswordResetOtp(buildResendOtpPayload(email));
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.email?.[0] || err.response?.data?.detail || 'Failed to resend OTP.',
      };
    } finally {
      setLoading(false);
    }
  }, []);

  return { sendOtp, verifyOtp, resetPassword, resendOtp, loading };
}
