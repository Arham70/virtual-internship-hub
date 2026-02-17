"""
Skill assessment models (FR2). Domain and User live in accounts.
"""
from django.conf import settings
from django.db import models


class SkillAssessment(models.Model):
    """Assessment test (e.g. per domain). Admin creates; students take."""
    title = models.CharField(max_length=200)
    domain = models.ForeignKey(
        'accounts.Domain',
        on_delete=models.CASCADE,
        related_name='skill_assessments',
        null=True,
        blank=True,
    )
    max_attempts = models.PositiveIntegerField(default=2)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'skill_assessments'
        ordering = ['-created_at']

    def __str__(self):
        return self.title


class AssessmentQuestion(models.Model):
    """MCQ question for a skill assessment."""
    CORRECT_CHOICES = [('A', 'A'), ('B', 'B'), ('C', 'C'), ('D', 'D')]

    assessment = models.ForeignKey(
        SkillAssessment,
        on_delete=models.CASCADE,
        related_name='questions',
    )
    text = models.TextField()
    option_a = models.CharField(max_length=500)
    option_b = models.CharField(max_length=500)
    option_c = models.CharField(max_length=500)
    option_d = models.CharField(max_length=500)
    correct_option = models.CharField(max_length=1, choices=CORRECT_CHOICES)
    order = models.PositiveIntegerField(default=0)
    points = models.PositiveIntegerField(default=1)

    class Meta:
        db_table = 'assessment_questions'
        ordering = ['assessment', 'order', 'id']

    def __str__(self):
        return f"{self.assessment.title} – Q{self.order}"


class StudentAssessmentAttempt(models.Model):
    """One student's submission of an assessment: score and recommended domains (FR2)."""
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='assessment_attempts',
    )
    assessment = models.ForeignKey(
        SkillAssessment,
        on_delete=models.CASCADE,
        related_name='attempts',
    )
    submitted_at = models.DateTimeField(auto_now_add=True)
    score = models.PositiveIntegerField(default=0)
    total_points = models.PositiveIntegerField(default=0)
    recommended_domains = models.ManyToManyField(
        'accounts.Domain',
        related_name='+',
        blank=True,
    )
    answers = models.JSONField(default=list, blank=True)

    class Meta:
        db_table = 'student_assessment_attempts'
        ordering = ['-submitted_at']

    def __str__(self):
        return f"{self.user.username} – {self.assessment.title} ({self.score}/{self.total_points})"
