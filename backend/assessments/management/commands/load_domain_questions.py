"""Load domain questions from backend/data/domain_questions.json into the database."""
import json
from pathlib import Path

from django.core.management.base import BaseCommand
from django.conf import settings

from accounts.models import Domain
from assessments.models import AssessmentQuestion


class Command(BaseCommand):
    help = 'Read domain_questions.json and add all questions to the database.'

    def handle(self, *args, **options):
        path = Path(settings.BASE_DIR) / 'data' / 'domain_questions.json'
        if not path.exists():
            self.stderr.write(self.style.ERROR(f'File not found: {path}'))
            return

        with open(path, 'r', encoding='utf-8') as f:
            data = json.load(f)

        total = 0
        for entry in data.get('domains', []):
            code = entry.get('code')
            if not code:
                continue
            try:
                domain = Domain.objects.get(code=code)
            except Domain.DoesNotExist:
                self.stdout.write(self.style.WARNING(f'Domain "{code}" not found. Run populate_domains.'))
                continue

            for order, q in enumerate(entry.get('questions', [])):
                if not q.get('text'):
                    continue
                AssessmentQuestion.objects.create(
                    domain=domain,
                    text=q['text'],
                    option_a=q.get('option_a', ''),
                    option_b=q.get('option_b', ''),
                    option_c=q.get('option_c', ''),
                    option_d=q.get('option_d', ''),
                    correct_option=q.get('correct_option', 'A')[:1].upper(),
                    complexity=q.get('complexity', 'MEDIUM').upper(),
                    order=order,
                    points=int(q.get('points', 1)),
                )
                total += 1
            self.stdout.write(self.style.SUCCESS(f'{domain.name}: {len(entry.get("questions", []))} questions'))

        self.stdout.write(self.style.SUCCESS(f'Done. Total: {total} questions.'))
