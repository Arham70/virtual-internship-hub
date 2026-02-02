from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from .models import User, StudentProfile, MentorProfile, DOMAIN_CHOICES, SKILL_LEVEL_CHOICES

class StudentProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentProfile
        fields = ('first_name', 'last_name', 'phone_number', 'bio', 
                  'current_skill_level', 'created_at', 'updated_at')
        read_only_fields = ('created_at', 'updated_at')

class MentorProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = MentorProfile
        fields = ('professional_bio', 'expertise_area', 'years_of_experience',
                  'is_available', 'created_at', 'updated_at')
        read_only_fields = ('created_at', 'updated_at')

class UserSerializer(serializers.ModelSerializer):
    student_profile = StudentProfileSerializer(read_only=True)
    mentor_profile = MentorProfileSerializer(read_only=True)
    
    class Meta:
        model = User
        fields = ('id', 'email', 'username', 'role', 'created_at',
                  'target_domain', 'student_profile', 'mentor_profile')
        read_only_fields = ('id', 'created_at')

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password]
    )
    password_confirm = serializers.CharField(write_only=True, required=True)
    
    # Student fields
    first_name = serializers.CharField(write_only=True, required=False)
    last_name = serializers.CharField(write_only=True, required=False)
    target_domain = serializers.ChoiceField(choices=DOMAIN_CHOICES, write_only=True, required=False)
    current_skill_level = serializers.ChoiceField(
        choices=SKILL_LEVEL_CHOICES, 
        write_only=True, 
        required=False
    )
    
    # Mentor fields
    professional_bio = serializers.CharField(write_only=True, required=False)
    expertise_area = serializers.CharField(write_only=True, required=False)
    
    class Meta:
        model = User
        fields = ('email', 'username', 'password', 'password_confirm', 'role',
                  'first_name', 'last_name', 'target_domain', 'current_skill_level',
                  'professional_bio', 'expertise_area')
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Passwords don't match")
        
        role = attrs.get('role', 'STUDENT')
        if role == 'STUDENT':
            if not attrs.get('first_name') or not attrs.get('last_name'):
                raise serializers.ValidationError("First name and last name required for students")
        elif role == 'MENTOR':
            if not attrs.get('professional_bio') or not attrs.get('expertise_area'):
                raise serializers.ValidationError("Professional bio and expertise area required for mentors")
        
        return attrs
    
    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already exists")
        return value
    
    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username already exists")
        return value
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        role = validated_data.pop('role', 'STUDENT')
        
        first_name = validated_data.pop('first_name', None)
        last_name = validated_data.pop('last_name', None)
        target_domain = validated_data.pop('target_domain', None)
        current_skill_level = validated_data.pop('current_skill_level', None)
        professional_bio = validated_data.pop('professional_bio', None)
        expertise_area = validated_data.pop('expertise_area', None)
        
        user = User.objects.create_user(role=role, target_domain=target_domain, **validated_data)
        
        # Update profile (signal creates it, we just update)
        if role == 'STUDENT' and hasattr(user, 'student_profile'):
            user.student_profile.first_name = first_name or user.username
            user.student_profile.last_name = last_name or ''
            user.student_profile.current_skill_level = current_skill_level
            user.student_profile.save()
        elif role == 'MENTOR' and hasattr(user, 'mentor_profile'):
            user.mentor_profile.professional_bio = professional_bio or ''
            user.mentor_profile.expertise_area = expertise_area or ''
            user.mentor_profile.save()
        
        return user

class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, required=True)
    
    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')
        
        if email and password:
            user = authenticate(request=self.context.get('request'),
                              email=email, password=password)
            if not user:
                raise serializers.ValidationError('Invalid email or password')
            if not user.is_active:
                raise serializers.ValidationError('Account is disabled')
            attrs['user'] = user
        else:
            raise serializers.ValidationError('Email and password required')
        
        return attrs

