from django.contrib import admin
from .models import AssessmentQuestion, StudentAssessmentAttempt


@admin.register(AssessmentQuestion)
class AssessmentQuestionAdmin(admin.ModelAdmin):
    list_display = ('domain', 'order', 'text_short', 'complexity', 'correct_option', 'points')
    list_filter = ('domain', 'complexity')
    ordering = ('domain', 'order')

    def text_short(self, obj):
        return (obj.text[:50] + '...') if len(obj.text) > 50 else obj.text
    text_short.short_description = 'Question'


@admin.register(StudentAssessmentAttempt)
class StudentAssessmentAttemptAdmin(admin.ModelAdmin):
    list_display = ('user', 'submitted_at', 'score', 'total_points')
    list_filter = ('submitted_at',)
    search_fields = ('user__username', 'user__email')
    readonly_fields = ('submitted_at', 'score', 'total_points', 'answers')
    filter_horizontal = ('test_domains', 'recommended_domains')
