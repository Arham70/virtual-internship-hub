from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Count
from django.shortcuts import get_object_or_404
from accounts.permissions import IsAdministrator, IsStudent
from .models import SkillAssessment, AssessmentQuestion, StudentAssessmentAttempt
from .serializers import (
    SkillAssessmentSerializer,
    SkillAssessmentCreateUpdateSerializer,
    AssessmentQuestionSerializer,
    AssessmentForStudentSerializer,
    AssessmentListItemSerializer,
    SubmitAnswersSerializer,
    AttemptResultSerializer,
)
from .services import compute_score_and_recommendations


class AdminAssessmentListCreateView(generics.ListCreateAPIView):
    """GET/POST admin/assessments/ – List or create skill assessments (admin only)."""
    permission_classes = [permissions.IsAuthenticated, IsAdministrator]

    def get_queryset(self):
        return SkillAssessment.objects.select_related('domain').prefetch_related('questions').all()

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return SkillAssessmentCreateUpdateSerializer
        return SkillAssessmentSerializer


class AdminAssessmentDetailView(generics.RetrieveUpdateDestroyAPIView):
    """GET/PUT/PATCH/DELETE admin/assessments/<id>/ – One assessment (admin only)."""
    permission_classes = [permissions.IsAuthenticated, IsAdministrator]
    serializer_class = SkillAssessmentSerializer
    queryset = SkillAssessment.objects.select_related('domain').prefetch_related('questions')


class AdminAssessmentQuestionListCreateView(generics.ListCreateAPIView):
    """GET/POST admin/assessments/<id>/questions/ – List or add MCQ questions (admin only)."""
    permission_classes = [permissions.IsAuthenticated, IsAdministrator]
    serializer_class = AssessmentQuestionSerializer

    def get_queryset(self):
        return AssessmentQuestion.objects.filter(
            assessment_id=self.kwargs['assessment_id']
        ).order_by('order', 'id')

    def perform_create(self, serializer):
        serializer.save(assessment_id=self.kwargs['assessment_id'])


# --------------- Student: list assessments, get for take, submit ---------------

class StudentAssessmentListView(generics.ListAPIView):
    """GET student/assessments/ – List active assessments (for current user's target domains)."""
    permission_classes = [permissions.IsAuthenticated, IsStudent]
    serializer_class = AssessmentListItemSerializer

    def get_queryset(self):
        qs = SkillAssessment.objects.filter(is_active=True).select_related('domain').prefetch_related('questions')
        qs = qs.annotate(_question_count=Count('questions'))
        profile = getattr(self.request.user, 'student_profile', None)
        if profile and profile.target_domains.exists():
            domain_ids = list(profile.target_domains.values_list('id', flat=True))
            qs = qs.filter(domain_id__in=domain_ids)
        return qs


class StudentAssessmentDetailView(generics.RetrieveAPIView):
    """GET student/assessments/<id>/ – Get assessment with questions for taking (no correct_option)."""
    permission_classes = [permissions.IsAuthenticated, IsStudent]
    serializer_class = AssessmentForStudentSerializer
    queryset = SkillAssessment.objects.filter(is_active=True).select_related('domain').prefetch_related('questions')


class StudentAssessmentSubmitView(APIView):
    """POST student/assessments/<id>/submit/ – Submit answers; compute score and recommend domains."""
    permission_classes = [permissions.IsAuthenticated, IsStudent]

    def post(self, request, pk):
        assessment = get_object_or_404(
            SkillAssessment.objects.filter(is_active=True).prefetch_related('questions'),
            pk=pk,
        )
        serializer = SubmitAnswersSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        answers_data = serializer.validated_data['answers']

        attempt_count = StudentAssessmentAttempt.objects.filter(
            user=request.user, assessment=assessment
        ).count()
        if attempt_count >= assessment.max_attempts:
            return Response(
                {'error': f'Maximum attempts ({assessment.max_attempts}) reached for this assessment.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        answers_tuples = [(a['question_id'], a['selected_option']) for a in answers_data]
        score, total_points, recommended_ids = compute_score_and_recommendations(assessment, answers_tuples)

        attempt = StudentAssessmentAttempt.objects.create(
            user=request.user,
            assessment=assessment,
            score=score,
            total_points=total_points,
            answers=serializer.validated_data['answers'],
        )
        if recommended_ids:
            attempt.recommended_domains.set(recommended_ids)

        result = AttemptResultSerializer(attempt)
        data = result.data
        data['percentage'] = round((score / total_points * 100), 1) if total_points else 0
        data['passed'] = data['percentage'] >= 60
        return Response(data, status=status.HTTP_201_CREATED)


class StudentAttemptListView(generics.ListAPIView):
    """GET student/attempts/ – List current user's assessment attempts."""
    permission_classes = [permissions.IsAuthenticated, IsStudent]
    serializer_class = AttemptResultSerializer

    def get_queryset(self):
        return StudentAssessmentAttempt.objects.filter(
            user=self.request.user
        ).select_related('assessment').prefetch_related('recommended_domains').order_by('-submitted_at')
