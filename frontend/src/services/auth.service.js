/**
 * Auth payload builders: login, logout, forgot-password.
 * Used by AuthContext and useForgotPassword; no API calls here.
 */

export function buildLoginPayload({ email, password }) {
  return { email, password };
}

export function buildLogoutPayload(refreshToken) {
  return { refresh_token: refreshToken };
}

export function buildSendOtpPayload(email) {
  return { email };
}

export function buildVerifyOtpPayload(email, otp) {
  return { email, otp };
}

export function buildResetPasswordPayload(email, otp, newPassword, newPasswordConfirm) {
  return {
    email,
    otp,
    new_password: newPassword,
    new_password_confirm: newPasswordConfirm,
  };
}

export function buildResendOtpPayload(email) {
  return { email };
}
