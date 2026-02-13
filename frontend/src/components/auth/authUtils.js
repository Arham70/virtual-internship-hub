/**
 * After login/signup, send user to the right dashboard by role
 */
export function redirectByRole(navigate, role) {
  if (role === 'STUDENT') {
    navigate('/student/dashboard');
  } else if (role === 'MENTOR') {
    navigate('/mentor/dashboard');
  } else if (role === 'ADMINISTRATOR') {
    navigate('/admin/dashboard');
  } else {
    navigate('/dashboard');
  }
}

/**
 * Get a single error message from API error response
 */
export function getErrorMessage(error) {
  if (!error) return 'Something went wrong.';
  if (typeof error === 'string') return error;
  if (error.non_field_errors && error.non_field_errors[0]) return error.non_field_errors[0];
  if (error.email && error.email[0]) return error.email[0];
  if (error.username && error.username[0]) return error.username[0];
  if (error.detail) return error.detail;
  return 'Something went wrong.';
}
