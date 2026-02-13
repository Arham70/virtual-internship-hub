from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    RegisterView,
    LoginView,
    LogoutView,
    SendPasswordResetOTPView,
    VerifyPasswordResetOTPView,
    ResetPasswordView,
    ResendPasswordResetOTPView,
    UserProfileView,
    StudentProfileView,
    MentorProfileView,
    StudentListView,
    MentorListView,
    DomainListView,
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    # Forgot password
    path('forgot-password/send-otp/', SendPasswordResetOTPView.as_view(), name='send-password-reset-otp'),
    path('forgot-password/verify-otp/', VerifyPasswordResetOTPView.as_view(), name='verify-password-reset-otp'),
    path('forgot-password/reset/', ResetPasswordView.as_view(), name='reset-password'),
    path('forgot-password/resend-otp/', ResendPasswordResetOTPView.as_view(), name='resend-password-reset-otp'),
    # Profile
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('student-profile/', StudentProfileView.as_view(), name='student-profile'),
    path('mentor-profile/', MentorProfileView.as_view(), name='mentor-profile'),
    # Lists
    path('students/', StudentListView.as_view(), name='student-list'),
    path('mentors/', MentorListView.as_view(), name='mentor-list'),
    path('domains/', DomainListView.as_view(), name='domain-list'),
]
