/**
 * Admin payload builders: domain create/update, question create/update.
 * Used by AdminDashboard; no API calls here.
 */

export function buildDomainPayload(form) {
  return {
    name: (form.name || '').trim(),
    code: (form.code || '').trim(),
    description: (form.description || '').trim() || '',
  };
}

export function buildQuestionPayload(questionForm, editingQuestion, questionsTotalCount) {
  return {
    text: questionForm.text,
    option_a: questionForm.option_a,
    option_b: questionForm.option_b,
    option_c: questionForm.option_c,
    option_d: questionForm.option_d,
    correct_option: questionForm.correct_option,
    complexity: questionForm.complexity || 'MEDIUM',
    order: editingQuestion ? Number(questionForm.order) : questionsTotalCount,
    points: Number(questionForm.points) || 1,
  };
}
