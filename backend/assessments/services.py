"""
Assessment scoring and domain recommendation (FR2). Rule-based; can be replaced by ML later.
"""


def compute_score_and_recommendations(assessment, answers):
    """
    Given an assessment and a list of {question_id, selected_option}, compute score
    and return (score, total_points, recommended_domain_ids).
    """
    questions = {q.id: q for q in assessment.questions.all()}
    score = 0
    total_points = 0
    for q_id, selected in answers:
        q = questions.get(q_id)
        if not q:
            continue
        total_points += q.points
        if (selected or '').strip().upper() == (q.correct_option or '').strip().upper():
            score += q.points

    recommended_ids = recommend_domains(assessment, score, total_points)
    return score, total_points, recommended_ids


def recommend_domains(assessment, score, total_points):
    """
    Rule-based: recommend assessment's domain if score >= 60%; else return empty or related.
    """
    if total_points <= 0:
        return []
    percentage = (score / total_points) * 100
    recommended = []
    if assessment.domain_id and percentage >= 60:
        recommended.append(assessment.domain_id)
    return recommended
