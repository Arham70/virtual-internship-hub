"""
FR2: AI-based domain recommendation (single highly recommended domain).
Input: per-domain scores. Output: one recommended domain_id.
Designed for easy swap to scikit-learn/ML later.
"""
from typing import Dict, Optional

# Per-domain: (score, total_points) -> percentage
DomainScores = Dict[int, tuple[int, int]]


def recommend_one_domain(per_domain_scores: DomainScores) -> Optional[int]:
    """
    Recommend a single domain that is the best fit (highest performance).
    Uses rule-based logic; can be replaced by a trained classifier (e.g. scikit-learn).
    """
    if not per_domain_scores:
        return None

    best_domain_id: Optional[int] = None
    best_percentage: float = -1.0

    for domain_id, (score, total) in per_domain_scores.items():
        if total <= 0:
            continue
        pct = (score / total) * 100
        if pct > best_percentage:
            best_percentage = pct
            best_domain_id = domain_id
        elif pct == best_percentage and best_domain_id is not None and domain_id < best_domain_id:
            # Tie-break by smaller id for determinism
            best_domain_id = domain_id

    return best_domain_id
