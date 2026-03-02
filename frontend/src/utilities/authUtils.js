/**
 * Redirect to the correct dashboard by role after login/signup.
 */
export function redirectByRole(navigate, role) {
  if (role === 'STUDENT') navigate('/student/dashboard');
  else if (role === 'MENTOR') navigate('/mentor/dashboard');
  else if (role === 'ADMINISTRATOR') navigate('/admin/dashboard');
  else navigate('/dashboard');
}

/**
 * Extract a single error message from API error response.
 */
export function getErrorMessage(error) {
  if (!error) return 'Something went wrong.';
  if (typeof error === 'string') return error;
  if (error.non_field_errors?.[0]) return error.non_field_errors[0];
  if (error.email?.[0]) return error.email[0];
  if (error.username?.[0]) return error.username[0];
  if (error.password?.[0]) return error.password[0];
  if (error.new_password?.[0]) return error.new_password[0];
  if (error.error) return typeof error.error === 'string' ? error.error : error.error[0];
  if (error.answers?.[0]) return typeof error.answers[0] === 'string' ? error.answers[0] : String(error.answers[0]);
  if (error.detail) return typeof error.detail === 'string' ? error.detail : (Array.isArray(error.detail) ? error.detail[0] : String(error.detail));
  if (error.message) return error.message;
  return 'Something went wrong.';
}
