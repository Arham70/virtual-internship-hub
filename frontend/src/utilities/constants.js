/** Auth view types */
export const VIEW = {
  LOGIN: 'login',
  SIGNUP: 'signup',
  FORGOT: 'forgot',
};

/** Forgot password steps */
export const FORGOT_STEP = {
  EMAIL: 'email',
  OTP: 'otp',
  NEW_PASSWORD: 'newPassword',
};

/** Signup steps (form → verify email OTP) */
export const SIGNUP_STEP = {
  FORM: 'form',
  OTP: 'otp',
};

/** User roles */
export const ROLE = {
  STUDENT: 'STUDENT',
  MENTOR: 'MENTOR',
  ADMINISTRATOR: 'ADMINISTRATOR',
};
