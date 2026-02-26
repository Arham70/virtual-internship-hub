"""
FR2: Scikit-learn–based domain recommendation (ML path).
Used by the submit-ml API only; existing rule-based recommend_one_domain is unchanged.
"""
from pathlib import Path
from typing import List, Optional, Tuple

from .ai_recommendation import DomainScores, recommend_one_domain

NUM_FEATURES = 3
_MODEL_CACHE = None
_MODEL_PATH = Path(__file__).resolve().parent / "model_domain_recommender.joblib"


def _build_features_and_domain_order(per_domain_scores: DomainScores) -> Tuple[List[float], List[int]]:
    """Build feature vector [pct1, pct2, pct3] and ordered domain_ids for mapping prediction index back."""
    if not per_domain_scores:
        return [0.0] * NUM_FEATURES, []
    sorted_ids = sorted(per_domain_scores.keys())
    domain_ids = sorted_ids[:NUM_FEATURES]
    features = []
    for did in domain_ids:
        score, total = per_domain_scores[did]
        pct = (score / total * 100.0) if total else 0.0
        features.append(pct)
    while len(features) < NUM_FEATURES:
        features.append(0.0)
    return features, domain_ids


def _load_model():
    """Load and cache the joblib model; return None if missing or on error."""
    global _MODEL_CACHE
    if _MODEL_CACHE is not None:
        return _MODEL_CACHE
    if not _MODEL_PATH.exists():
        return None
    try:
        import joblib
        _MODEL_CACHE = joblib.load(_MODEL_PATH)
        return _MODEL_CACHE
    except Exception:
        return None


def recommend_one_domain_ml(per_domain_scores: DomainScores) -> Optional[int]:
    """
    Recommend one domain using the Scikit-learn model when available.
    Falls back to rule-based recommend_one_domain if model is missing or prediction fails.
    """
    if not per_domain_scores:
        return recommend_one_domain(per_domain_scores)
    features, domain_ids = _build_features_and_domain_order(per_domain_scores)
    if not domain_ids:
        return None
    if len(domain_ids) == 1:
        return domain_ids[0]
    model = _load_model()
    if model is None:
        return recommend_one_domain(per_domain_scores)
    try:
        X = [features]
        pred = model.predict(X)
        idx = int(pred[0])
        if 0 <= idx < len(domain_ids):
            return domain_ids[idx]
    except Exception:
        pass
    return recommend_one_domain(per_domain_scores)
