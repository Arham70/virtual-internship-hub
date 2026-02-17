/**
 * Auth page logic: payload building and validation.
 * Used by AuthPage; no API calls here (handled by hooks).
 */
import { ROLE } from '../utilities/constants';

export function buildSignupPayload(fields) {
  const {
    role,
    studentEmail,
    mentorEmail,
    studentUsername,
    mentorUsername,
    studentPassword,
    mentorPassword,
    studentConfirmPassword,
    mentorConfirmPassword,
    firstName,
    lastName,
    targetDomainIds,
    professionalBio,
    expertiseDomainId,
  } = fields;
  const payload = {
    email: role === ROLE.STUDENT ? studentEmail : mentorEmail,
    username: role === ROLE.STUDENT ? studentUsername : mentorUsername,
    password: role === ROLE.STUDENT ? studentPassword : mentorPassword,
    password_confirm: role === ROLE.STUDENT ? studentConfirmPassword : mentorConfirmPassword,
    role,
  };
  if (role === ROLE.STUDENT) {
    payload.first_name = firstName;
    payload.last_name = lastName;
    payload.target_domain_ids = targetDomainIds;
    payload.current_skill_level = 'BEGINNER';
  } else {
    payload.professional_bio = professionalBio;
    payload.expertise_domain_id = expertiseDomainId ? parseInt(expertiseDomainId, 10) : null;
  }
  return payload;
}

export function validateSignup(fields, setError) {
  const {
    role,
    firstName,
    lastName,
    studentEmail,
    studentUsername,
    studentPassword,
    studentConfirmPassword,
    targetDomainIds,
    mentorEmail,
    mentorUsername,
    mentorPassword,
    mentorConfirmPassword,
    professionalBio,
    expertiseDomainId,
  } = fields;
  if (role === ROLE.STUDENT) {
    if (!firstName || !lastName || !studentEmail || !studentUsername || !studentPassword || !studentConfirmPassword) {
      setError('Please fill in all required fields.');
      return false;
    }
    if (studentPassword !== studentConfirmPassword) {
      setError('Passwords do not match.');
      return false;
    }
    if (targetDomainIds.length === 0) {
      setError('Please select at least one target domain.');
      return false;
    }
  } else {
    if (!mentorEmail || !mentorUsername || !mentorPassword || !mentorConfirmPassword || !professionalBio || !expertiseDomainId) {
      setError('Please fill in all required fields.');
      return false;
    }
    if (mentorPassword !== mentorConfirmPassword) {
      setError('Passwords do not match.');
      return false;
    }
  }
  return true;
}
