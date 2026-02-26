# Generated for FR2: question complexity (easy, medium, hard)

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('assessments', '0002_studentassessmentattempt_assessment_nullable'),
    ]

    operations = [
        migrations.AddField(
            model_name='assessmentquestion',
            name='complexity',
            field=models.CharField(
                choices=[('EASY', 'Easy'), ('MEDIUM', 'Medium'), ('HARD', 'Hard')],
                default='MEDIUM',
                max_length=10,
            ),
        ),
    ]
