/**
 * Student payload builders: profile update, assessment submit.
 * Used by StudentDashboard; no API calls here.
 */

export function buildProfileUpdatePayload(targetDomainIds) {
  return { target_domain_ids: targetDomainIds };
}

export function buildAssessmentSubmitPayload(questions, selectedAnswers) {
  const answers = (questions || []).map((q, i) => ({
    question_id: q.id,
    selected_option: selectedAnswers[i] || 'A',
  }));
  return { answers };
}
