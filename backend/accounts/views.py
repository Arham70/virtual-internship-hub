from rest_framework import status, generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import login, logout
from .serializers import (
    UserRegistrationSerializer,
    UserLoginSerializer,
    UserSerializer,
    StudentProfileSerializer,
    MentorProfileSerializer
)
from .models import User, StudentProfile, MentorProfile

# Registration
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = UserRegistrationSerializer
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        refresh = RefreshToken.for_user(user)
        
        # Get profile data
        profile_data = None
        if user.is_student and hasattr(user, 'student_profile'):
            profile_data = StudentProfileSerializer(user.student_profile).data
        elif user.is_mentor and hasattr(user, 'mentor_profile'):
            profile_data = MentorProfileSerializer(user.mentor_profile).data
        
        return Response({
            'message': 'Registration successful',
            'user': UserSerializer(user).data,
            'profile': profile_data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }, status=status.HTTP_201_CREATED)

# Login
@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def login_view(request):
    serializer = UserLoginSerializer(data=request.data, context={'request': request})
    
    if serializer.is_valid():
        user = serializer.validated_data['user']
        login(request, user)
        
        refresh = RefreshToken.for_user(user)
        
        profile_data = None
        if user.is_student and hasattr(user, 'student_profile'):
            profile_data = StudentProfileSerializer(user.student_profile).data
        elif user.is_mentor and hasattr(user, 'mentor_profile'):
            profile_data = MentorProfileSerializer(user.mentor_profile).data
        
        return Response({
            'message': 'Login successful',
            'user': UserSerializer(user).data,
            'profile': profile_data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }, status=status.HTTP_200_OK)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Logout
@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def logout_view(request):
    try:
        refresh_token = request.data.get('refresh_token')
        if refresh_token:
            token = RefreshToken(refresh_token)
            token.blacklist()
        logout(request)
        return Response({'message': 'Logout successful'}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

# User Profile
class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        return self.request.user

# Student Profile
class StudentProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = StudentProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        if not self.request.user.is_student:
            return None
        return getattr(self.request.user, 'student_profile', None)
    
    def get(self, request, *args, **kwargs):
        if not request.user.is_student:
            return Response(
                {'error': 'Only students can access this'},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().get(request, *args, **kwargs)

# Mentor Profile
class MentorProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = MentorProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        if not self.request.user.is_mentor:
            return None
        return getattr(self.request.user, 'mentor_profile', None)
    
    def get(self, request, *args, **kwargs):
        if not request.user.is_mentor:
            return Response(
                {'error': 'Only mentors can access this'},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().get(request, *args, **kwargs)

# List Students (for mentors/admins)
class StudentListView(generics.ListAPIView):
    serializer_class = StudentProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.is_administrator or user.is_mentor:
            return StudentProfile.objects.select_related('user').all()
        return StudentProfile.objects.none()

# List Mentors
class MentorListView(generics.ListAPIView):
    serializer_class = MentorProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.is_student:
            # Students see only available mentors
            return MentorProfile.objects.filter(is_available=True)
        # Admins and mentors see all
        return MentorProfile.objects.all()

