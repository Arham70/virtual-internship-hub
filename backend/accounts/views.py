"""
All API views in one file. Sections: Auth, Student, Mentor, Admin, Domains.
"""
from rest_framework import status, generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import NotFound
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import logout
from django.core.exceptions import ValidationError
from django.contrib.auth.password_validation import validate_password

from .models import User, StudentProfile, MentorProfile, Domain
from .serializers import (
    UserRegistrationSerializer,
    UserLoginSerializer,
    UserSerializer,
    CreateAdministratorSerializer,
    StudentProfileSerializer,
    MentorProfileSerializer,
    DomainSerializer,
    SendPasswordResetOTPSerializer,
    VerifyPasswordResetOTPSerializer,
    ResetPasswordSerializer,
    AdminStudentListItemSerializer,
    AdminMentorListItemSerializer,
)
from .permissions import IsSuperuser, IsAdministrator
from .services.email import (
    create_and_send_password_reset_otp,
    verify_password_reset_otp,
    consume_otp,
)


def tokens_and_user_response(user):
    """Build auth response with user, profile, and JWT tokens."""
    refresh = RefreshToken.for_user(user)
    profile_data = None
    if user.is_student and hasattr(user, 'student_profile'):
        profile_data = StudentProfileSerializer(user.student_profile).data
    elif user.is_mentor and hasattr(user, 'mentor_profile'):
        profile_data = MentorProfileSerializer(user.mentor_profile).data
    return {
        'user': UserSerializer(user).data,
        'profile': profile_data,
        'tokens': {'refresh': str(refresh), 'access': str(refresh.access_token)},
    }


# --------------- Auth ---------------

class RegisterView(generics.CreateAPIView):
    """POST auth/register/ – Create account (Student or Mentor)."""
    queryset = User.objects.none()
    permission_classes = [permissions.AllowAny]
    serializer_class = UserRegistrationSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        data = tokens_and_user_response(user)
        data['message'] = 'Registration successful'
        return Response(data, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    """POST auth/login/ – Login with email/password. Returns JWT tokens."""
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = UserLoginSerializer(data=request.data, context={'request': request})
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        user = serializer.validated_data['user']
        data = tokens_and_user_response(user)
        data['message'] = 'Login successful'
        return Response(data, status=status.HTTP_200_OK)


class LogoutView(APIView):
    """POST auth/logout/ – Blacklist refresh token."""
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


class SendPasswordResetOTPView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = SendPasswordResetOTPSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        email = serializer.validated_data['email']
        _, ok = create_and_send_password_reset_otp(email)
        if not ok:
            return Response({'email': 'No account found with this email.'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'message': 'OTP sent to your email. It expires in 2 minutes.'}, status=status.HTTP_200_OK)


class VerifyPasswordResetOTPView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = VerifyPasswordResetOTPSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        email = serializer.validated_data['email']
        otp = serializer.validated_data['otp']
        record = verify_password_reset_otp(email, otp)
        if not record:
            return Response({'otp': 'Invalid or expired OTP.'}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'message': 'OTP verified. You can now reset your password.'}, status=status.HTTP_200_OK)


class ResetPasswordView(APIView):
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
            return Response({'otp': 'Invalid or expired OTP.'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            validate_password(new_password)
        except ValidationError as e:
            return Response({'new_password': list(e.messages)}, status=status.HTTP_400_BAD_REQUEST)
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({'email': 'No account found with this email.'}, status=status.HTTP_404_NOT_FOUND)
        user.set_password(new_password)
        user.save()
        consume_otp(record)
        return Response({'message': 'Password reset successful. You can now log in.'}, status=status.HTTP_200_OK)


class ResendPasswordResetOTPView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = SendPasswordResetOTPSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        email = serializer.validated_data['email']
        _, ok = create_and_send_password_reset_otp(email)
        if not ok:
            return Response({'email': 'No account found with this email.'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'message': 'New OTP sent. It expires in 2 minutes.'}, status=status.HTTP_200_OK)


class UserProfileView(generics.RetrieveUpdateAPIView):
    """GET/PUT auth/profile/ – Current user profile."""
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


# --------------- Student ---------------

class StudentProfileView(generics.RetrieveUpdateAPIView):
    """GET/PUT students/profile/ – Student profile (students only)."""
    serializer_class = StudentProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        profile = getattr(self.request.user, 'student_profile', None)
        if profile is None:
            raise NotFound('Student profile not found.')
        return profile

    def get(self, request, *args, **kwargs):
        if not request.user.is_student:
            return Response({'error': 'Only students can access this.'}, status=status.HTTP_403_FORBIDDEN)
        return super().get(request, *args, **kwargs)


class StudentListView(generics.ListAPIView):
    """GET students/ – List students (mentors and admins)."""
    serializer_class = StudentProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_administrator or self.request.user.is_mentor:
            return StudentProfile.objects.select_related('user').all()
        return StudentProfile.objects.none()


# --------------- Mentor ---------------

class MentorProfileView(generics.RetrieveUpdateAPIView):
    """GET/PUT mentors/profile/ – Mentor profile (mentors only)."""
    serializer_class = MentorProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        profile = getattr(self.request.user, 'mentor_profile', None)
        if profile is None:
            raise NotFound('Mentor profile not found.')
        return profile

    def get(self, request, *args, **kwargs):
        if not request.user.is_mentor:
            return Response({'error': 'Only mentors can access this.'}, status=status.HTTP_403_FORBIDDEN)
        return super().get(request, *args, **kwargs)


class MentorListView(generics.ListAPIView):
    """GET mentors/ – List mentors."""
    serializer_class = MentorProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_student:
            return MentorProfile.objects.filter(is_available=True)
        return MentorProfile.objects.all()


# --------------- Admin ---------------

class CreateAdministratorView(generics.CreateAPIView):
    """POST admin/administrators/ – Create administrator (superuser only)."""
    permission_classes = [permissions.IsAuthenticated, IsSuperuser]
    serializer_class = CreateAdministratorSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class AdminStudentListView(generics.ListAPIView):
    """GET admin/users/students/ – List all students (admin only). Administrator users are not listed."""
    permission_classes = [permissions.IsAuthenticated, IsAdministrator]
    serializer_class = AdminStudentListItemSerializer
    queryset = User.objects.filter(role='STUDENT').select_related('student_profile').prefetch_related('student_profile__target_domains')
    pagination_class = None


class AdminMentorListView(generics.ListAPIView):
    """GET admin/users/mentors/ – List all mentors (admin only). Administrator users are not listed."""
    permission_classes = [permissions.IsAuthenticated, IsAdministrator]
    serializer_class = AdminMentorListItemSerializer
    queryset = User.objects.filter(role='MENTOR').select_related('mentor_profile', 'mentor_profile__expertise_domain')
    pagination_class = None


# --------------- Domains (shared) ---------------

class DomainListView(generics.ListAPIView):
    """GET domains/ – List domains (public, unpaginated)."""
    serializer_class = DomainSerializer
    permission_classes = [permissions.AllowAny]
    queryset = Domain.objects.all()
    pagination_class = None
