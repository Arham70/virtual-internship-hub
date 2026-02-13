/**
 * Auth screen types: which form is shown
 */
export const VIEW = {
  LOGIN: 'login',
  SIGNUP: 'signup',
  FORGOT: 'forgot',
};

/**
 * Forgot password has 3 steps: enter email → enter OTP → enter new password
 */
export const FORGOT_STEP = {
  EMAIL: 'email',
  OTP: 'otp',
  NEW_PASSWORD: 'newPassword',
};

/**
 * Role when signing up
 */
export const ROLE = {
  STUDENT: 'STUDENT',
  MENTOR: 'MENTOR',
};

/**
 * Options for skill level dropdown (value is sent to API)
 */
export const SKILL_LEVEL_OPTIONS = [
  { value: '', label: 'Select level' },
  { value: 'BEGINNER', label: 'Beginner' },
  { value: 'INTERMEDIATE', label: 'Intermediate' },
  { value: 'ADVANCED', label: 'Advanced' },
  { value: 'EXPERT', label: 'Expert' },
];
