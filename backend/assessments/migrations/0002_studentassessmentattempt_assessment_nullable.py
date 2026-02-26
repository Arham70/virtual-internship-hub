# Generated for FR2 composed assessment (multi-domain)

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('assessments', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='studentassessmentattempt',
            name='assessment',
            field=models.ForeignKey(
                blank=True,
                help_text='Null for composed (multi-domain) assessments.',
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name='attempts',
                to='assessments.skillassessment',
            ),
        ),
    ]
