"""
Train Scikit-learn domain recommender on synthetic data.
Run: python manage.py train_domain_recommender
Saves model to assessments/model_domain_recommender.joblib for use by submit-ml API.
"""
import random
from pathlib import Path

from django.core.management.base import BaseCommand


NUM_FEATURES = 3
NUM_SAMPLES = 2000
RANDOM_SEED = 42


class Command(BaseCommand):
    help = 'Train domain recommender model (synthetic data) and save to assessments app dir.'

    def handle(self, *args, **options):
        try:
            from sklearn.ensemble import RandomForestClassifier
            import joblib
        except ImportError as e:
            self.stderr.write(self.style.ERROR(f'Install scikit-learn and joblib: {e}'))
            return

        random.seed(RANDOM_SEED)
        X = []
        y = []

        for _ in range(NUM_SAMPLES):
            # Synthetic: 3 percentages in [0, 100]; label = index of max (tie-break: smallest index)
            pcts = [random.uniform(0, 100) for _ in range(NUM_FEATURES)]
            best_idx = 0
            best_val = pcts[0]
            for i in range(1, NUM_FEATURES):
                if pcts[i] > best_val:
                    best_val = pcts[i]
                    best_idx = i
            X.append(pcts)
            y.append(best_idx)

        model = RandomForestClassifier(n_estimators=50, max_depth=5, random_state=RANDOM_SEED)
        model.fit(X, y)

        app_dir = Path(__file__).resolve().parent.parent.parent
        path = app_dir / 'model_domain_recommender.joblib'
        joblib.dump(model, path)
        self.stdout.write(self.style.SUCCESS(f'Model saved to {path}'))
