from django.contrib import admin
from .models import SkillAssessment, AssessmentQuestion, StudentAssessmentAttempt


class AssessmentQuestionInline(admin.TabularInline):
    model = AssessmentQuestion
    extra = 1
    ordering = ('order',)


@admin.register(SkillAssessment)
class SkillAssessmentAdmin(admin.ModelAdmin):
    list_display = ('title', 'domain', 'max_attempts', 'is_active', 'created_at')
    list_filter = ('is_active', 'domain')
    search_fields = ('title',)
    inlines = [AssessmentQuestionInline]
    readonly_fields = ('created_at', 'updated_at')


@admin.register(AssessmentQuestion)
class AssessmentQuestionAdmin(admin.ModelAdmin):
    list_display = ('assessment', 'order', 'text_short', 'correct_option', 'points')
    list_filter = ('assessment',)
    ordering = ('assessment', 'order')

    def text_short(self, obj):
        return (obj.text[:50] + '...') if len(obj.text) > 50 else obj.text
    text_short.short_description = 'Question'


@admin.register(StudentAssessmentAttempt)
class StudentAssessmentAttemptAdmin(admin.ModelAdmin):
    list_display = ('user', 'assessment', 'submitted_at', 'score', 'total_points')
    list_filter = ('assessment', 'submitted_at')
    search_fields = ('user__username', 'user__email')
    readonly_fields = ('submitted_at', 'score', 'total_points', 'answers')
    filter_horizontal = ('recommended_domains',)
