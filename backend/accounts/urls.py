from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    RegisterView, login_view, logout_view, UserProfileView,
    StudentProfileView, MentorProfileView,
    StudentListView, MentorListView, DomainListView
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', login_view, name='login'),
    path('logout/', logout_view, name='logout'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('student-profile/', StudentProfileView.as_view(), name='student-profile'),
    path('mentor-profile/', MentorProfileView.as_view(), name='mentor-profile'),
    path('students/', StudentListView.as_view(), name='student-list'),
    path('mentors/', MentorListView.as_view(), name='mentor-list'),
    path('domains/', DomainListView.as_view(), name='domain-list'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]

