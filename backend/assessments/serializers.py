from rest_framework import serializers
from accounts.serializers import DomainSerializer
from .models import SkillAssessment, AssessmentQuestion, StudentAssessmentAttempt


class AssessmentQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = AssessmentQuestion
        fields = (
            'id', 'text', 'option_a', 'option_b', 'option_c', 'option_d',
            'correct_option', 'order', 'points',
        )
        read_only_fields = ('id',)


class SkillAssessmentSerializer(serializers.ModelSerializer):
    domain_detail = DomainSerializer(source='domain', read_only=True)
    questions = AssessmentQuestionSerializer(many=True, read_only=True)

    class Meta:
        model = SkillAssessment
        fields = (
            'id', 'title', 'domain', 'domain_detail', 'max_attempts', 'is_active',
            'created_at', 'updated_at', 'questions',
        )
        read_only_fields = ('id', 'created_at', 'updated_at')


class SkillAssessmentCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = SkillAssessment
        fields = ('id', 'title', 'domain', 'max_attempts', 'is_active')
        read_only_fields = ('id',)


# --------------- Student: take assessment (no correct_option) and submit ---------------

class QuestionForStudentSerializer(serializers.ModelSerializer):
    """MCQ for student: options only, no correct_option."""
    class Meta:
        model = AssessmentQuestion
        fields = ('id', 'text', 'option_a', 'option_b', 'option_c', 'option_d', 'order')
        read_only_fields = ('id',)


class AssessmentForStudentSerializer(serializers.ModelSerializer):
    """Assessment with questions for taking (no correct answers)."""
    domain_detail = DomainSerializer(source='domain', read_only=True)
    questions = QuestionForStudentSerializer(many=True, read_only=True)

    class Meta:
        model = SkillAssessment
        fields = ('id', 'title', 'domain_detail', 'max_attempts', 'questions')
        read_only_fields = ('id',)


class SubmitAnswersSerializer(serializers.Serializer):
    answers = serializers.ListField(
        child=serializers.DictField(),
        help_text='List of {question_id: int, selected_option: "A"|"B"|"C"|"D"}',
    )

    def validate_answers(self, value):
        for item in value:
            if 'question_id' not in item or 'selected_option' not in item:
                raise serializers.ValidationError('Each item must have question_id and selected_option.')
        return value


class AttemptResultSerializer(serializers.ModelSerializer):
    recommended_domains = DomainSerializer(many=True, read_only=True)
    assessment_title = serializers.CharField(source='assessment.title', read_only=True)

    class Meta:
        model = StudentAssessmentAttempt
        fields = ('id', 'assessment', 'assessment_title', 'submitted_at', 'score', 'total_points', 'recommended_domains')
        read_only_fields = ('id', 'submitted_at', 'score', 'total_points')


class AssessmentListItemSerializer(serializers.ModelSerializer):
    """Minimal assessment for list (student: available to take)."""
    domain_detail = DomainSerializer(source='domain', read_only=True)
    question_count = serializers.SerializerMethodField()
    attempt_count = serializers.SerializerMethodField()

    class Meta:
        model = SkillAssessment
        fields = ('id', 'title', 'domain_detail', 'max_attempts', 'question_count', 'attempt_count')

    def get_question_count(self, obj):
        return getattr(obj, '_question_count', obj.questions.count())

    def get_attempt_count(self, obj):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return 0
        return obj.attempts.filter(user=request.user).count()
