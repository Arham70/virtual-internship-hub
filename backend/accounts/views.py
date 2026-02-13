"""
All account API views use class-based approach (APIView / generics).
JWT is used for authentication; AllowAny where needed.
"""
from rest_framework import status, generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import logout
from django.core.exceptions import ValidationError
from django.contrib.auth.password_validation import validate_password

from .models import User, StudentProfile, MentorProfile, Domain
from .serializers import (
    UserRegistrationSerializer,
    UserLoginSerializer,
    UserSerializer,
    StudentProfileSerializer,
    MentorProfileSerializer,
    DomainSerializer,
    SendPasswordResetOTPSerializer,
    VerifyPasswordResetOTPSerializer,
    ResetPasswordSerializer,
)
from .services.email import (
    create_and_send_password_reset_otp,
    verify_password_reset_otp,
    consume_otp,
)


def _tokens_and_user_response(user):
    """Build standard auth response with user, profile, and JWT tokens."""
    refresh = RefreshToken.for_user(user)
    profile_data = None
    if user.is_student and hasattr(user, 'student_profile'):
        profile_data = StudentProfileSerializer(user.student_profile).data
    elif user.is_mentor and hasattr(user, 'mentor_profile'):
        profile_data = MentorProfileSerializer(user.mentor_profile).data
    return {
        'user': UserSerializer(user).data,
        'profile': profile_data,
        'tokens': {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        },
    }


# --------------- Auth (AllowAny) ---------------

class RegisterView(generics.CreateAPIView):
    """POST /register/ – Create account (Student or Mentor)."""
    queryset = User.objects.none()
    permission_classes = [permissions.AllowAny]
    serializer_class = UserRegistrationSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        data = _tokens_and_user_response(user)
        data['message'] = 'Registration successful'
        return Response(data, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    """POST /login/ – Login with email/password. Returns JWT tokens."""
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = UserLoginSerializer(data=request.data, context={'request': request})
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        user = serializer.validated_data['user']
        data = _tokens_and_user_response(user)
        data['message'] = 'Login successful'
        return Response(data, status=status.HTTP_200_OK)


class LogoutView(APIView):
    """POST /logout/ – Blacklist refresh token. Requires JWT."""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        refresh_token = request.data.get('refresh_token')
        if refresh_token:
            try:
                token = RefreshToken(refresh_token)
                token.blacklist()
            except Exception:
                pass
        logout(request)
        return Response({'message': 'Logout successful'}, status=status.HTTP_200_OK)


# --------------- Forgot Password (AllowAny) ---------------

class SendPasswordResetOTPView(APIView):
    """POST /forgot-password/send-otp/ – Send OTP to email. OTP expires in 2 minutes."""
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = SendPasswordResetOTPSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        email = serializer.validated_data['email']
        record, ok = create_and_send_password_reset_otp(email)
        if not ok:
            return Response(
                {'email': 'No account found with this email.'},
                status=status.HTTP_404_NOT_FOUND,
            )
        return Response(
            {'message': 'OTP sent to your email. It expires in 2 minutes.'},
            status=status.HTTP_200_OK,
        )


class VerifyPasswordResetOTPView(APIView):
    """POST /forgot-password/verify-otp/ – Verify OTP is valid (and not expired)."""
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = VerifyPasswordResetOTPSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        email = serializer.validated_data['email']
        otp = serializer.validated_data['otp']
        record = verify_password_reset_otp(email, otp)
        if not record:
            return Response(
                {'otp': 'Invalid or expired OTP.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        return Response(
            {'message': 'OTP verified. You can now reset your password.'},
            status=status.HTTP_200_OK,
        )


class ResetPasswordView(APIView):
    """POST /forgot-password/reset/ – Set new password after verifying OTP."""
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        email = serializer.validated_data['email']
        otp = serializer.validated_data['otp']
        new_password = serializer.validated_data['new_password']

        record = verify_password_reset_otp(email, otp)
        if not record:
            return Response(
                {'otp': 'Invalid or expired OTP.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            validate_password(new_password)
        except ValidationError as e:
            return Response(
                {'new_password': list(e.messages)},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = User.objects.get(email=email)
        user.set_password(new_password)
        user.save()
        consume_otp(record)
        return Response(
            {'message': 'Password reset successful. You can now log in.'},
            status=status.HTTP_200_OK,
        )


class ResendPasswordResetOTPView(APIView):
    """POST /forgot-password/resend-otp/ – Resend OTP (same as send-otp, new OTP)."""
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = SendPasswordResetOTPSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        email = serializer.validated_data['email']
        record, ok = create_and_send_password_reset_otp(email)
        if not ok:
            return Response(
                {'email': 'No account found with this email.'},
                status=status.HTTP_404_NOT_FOUND,
            )
        return Response(
            {'message': 'New OTP sent. It expires in 2 minutes.'},
            status=status.HTTP_200_OK,
        )


# --------------- Profile (JWT required) ---------------

class UserProfileView(generics.RetrieveUpdateAPIView):
    """GET/PUT /profile/ – Current user profile."""
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


class StudentProfileView(generics.RetrieveUpdateAPIView):
    """GET/PUT /student-profile/ – Student profile (students only)."""
    serializer_class = StudentProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return getattr(self.request.user, 'student_profile', None)

    def get(self, request, *args, **kwargs):
        if not request.user.is_student:
            return Response(
                {'error': 'Only students can access this.'},
                status=status.HTTP_403_FORBIDDEN,
            )
        return super().get(request, *args, **kwargs)


class MentorProfileView(generics.RetrieveUpdateAPIView):
    """GET/PUT /mentor-profile/ – Mentor profile (mentors only)."""
    serializer_class = MentorProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return getattr(self.request.user, 'mentor_profile', None)

    def get(self, request, *args, **kwargs):
        if not request.user.is_mentor:
            return Response(
                {'error': 'Only mentors can access this.'},
                status=status.HTTP_403_FORBIDDEN,
            )
        return super().get(request, *args, **kwargs)


# --------------- Lists (JWT required) ---------------

class StudentListView(generics.ListAPIView):
    """GET /students/ – List students (mentors/admins)."""
    serializer_class = StudentProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_administrator or self.request.user.is_mentor:
            return StudentProfile.objects.select_related('user').all()
        return StudentProfile.objects.none()


class MentorListView(generics.ListAPIView):
    """GET /mentors/ – List mentors."""
    serializer_class = MentorProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_student:
            return MentorProfile.objects.filter(is_available=True)
        return MentorProfile.objects.all()


class DomainListView(generics.ListAPIView):
    """GET /domains/ – List domains (public)."""
    serializer_class = DomainSerializer
    permission_classes = [permissions.AllowAny]
    queryset = Domain.objects.all()
