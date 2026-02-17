from django.urls import path
from .views import (
    AdminAssessmentListCreateView,
    AdminAssessmentDetailView,
    AdminAssessmentQuestionListCreateView,
    StudentAssessmentListView,
    StudentAssessmentDetailView,
    StudentAssessmentSubmitView,
    StudentAttemptListView,
)

urlpatterns = [
    path('admin/assessments/', AdminAssessmentListCreateView.as_view(), name='assessment-list-create'),
    path('admin/assessments/<int:pk>/', AdminAssessmentDetailView.as_view(), name='assessment-detail'),
    path('admin/assessments/<int:assessment_id>/questions/', AdminAssessmentQuestionListCreateView.as_view(), name='assessment-questions'),
    path('student/assessments/', StudentAssessmentListView.as_view(), name='student-assessment-list'),
    path('student/assessments/<int:pk>/', StudentAssessmentDetailView.as_view(), name='student-assessment-detail'),
    path('student/assessments/<int:pk>/submit/', StudentAssessmentSubmitView.as_view(), name='student-assessment-submit'),
    path('student/attempts/', StudentAttemptListView.as_view(), name='student-attempt-list'),
]
