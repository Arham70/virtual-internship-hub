/**
 * Mentor payload builders. Used by MentorDashboard; no API calls here.
 */

export function buildMentorProfilePayload({ professional_bio, expertise_domain_id, years_of_experience, is_available }) {
  const payload = {
    professional_bio: (professional_bio ?? '').trim(),
    years_of_experience: Number(years_of_experience) || 0,
    is_available: Boolean(is_available),
  };
  if (expertise_domain_id !== undefined && expertise_domain_id !== '' && expertise_domain_id !== null) {
    payload.expertise_domain_id = Number(expertise_domain_id) || null;
  }
  return payload;
}
