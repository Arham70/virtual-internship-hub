from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.utils import timezone

# Choices
SKILL_LEVEL_CHOICES = [
    ('BEGINNER', 'Beginner'),
    ('INTERMEDIATE', 'Intermediate'),
    ('ADVANCED', 'Advanced'),
    ('EXPERT', 'Expert'),
]

# Domain Model for managing domains
class Domain(models.Model):
    name = models.CharField(max_length=50, unique=True)
    code = models.CharField(max_length=50, unique=True)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'domains'
        ordering = ['name']
    
    def __str__(self):
        return self.name

class UserManager(BaseUserManager):
    def create_user(self, email, username, password=None, role='STUDENT', **extra_fields):
        if not email:
            raise ValueError('Email is required')
        if not username:
            raise ValueError('Username is required')
        
        email = self.normalize_email(email)
        user = self.model(email=email, username=username, role=role, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, username, password=None, **extra_fields):
        extra_fields.setdefault('role', 'ADMINISTRATOR')
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, username, password, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
    ROLE_CHOICES = [
        ('STUDENT', 'Student'),
        ('MENTOR', 'Mentor'),
        ('ADMINISTRATOR', 'Administrator'),
    ]
    
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=150, unique=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='STUDENT')
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_email_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now)
    
    objects = UserManager()
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    
    class Meta:
        db_table = 'users'
    
    def __str__(self):
        return f"{self.username} ({self.role})"
    
    @property
    def is_student(self):
        return self.role == 'STUDENT'
    
    @property
    def is_mentor(self):
        return self.role == 'MENTOR'
    
    @property
    def is_administrator(self):
        return self.role == 'ADMINISTRATOR'

class StudentProfile(models.Model):
    user = models.OneToOneField(
        User, 
        on_delete=models.CASCADE, 
        related_name='student_profile',
        primary_key=True
    )
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    bio = models.TextField(blank=True, null=True)
    
    # Skill level stored in student profile
    current_skill_level = models.CharField(
        max_length=20, 
        choices=SKILL_LEVEL_CHOICES, 
        blank=True, 
        null=True
    )
    
    # Multiple target domains for students
    target_domains = models.ManyToManyField(
        Domain,
        related_name='students',
        blank=True
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'student_profiles'
    
    def __str__(self):
        return f"{self.first_name} {self.last_name}"

class MentorProfile(models.Model):
    user = models.OneToOneField(
        User, 
        on_delete=models.CASCADE, 
        related_name='mentor_profile',
        primary_key=True
    )
    professional_bio = models.TextField()
    # Single domain expertise for mentors
    expertise_domain = models.ForeignKey(
        Domain,
        on_delete=models.SET_NULL,
        related_name='mentors',
        null=True,
        blank=True
    )
    years_of_experience = models.PositiveIntegerField(default=0)
    is_available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'mentor_profiles'
    
    def __str__(self):
        return f"{self.user.username} - Mentor"


class PasswordResetOTP(models.Model):
    """OTP for forgot password. Expires in 2 minutes."""
    email = models.EmailField(db_index=True)
    otp = models.CharField(max_length=6)
    expires_at = models.DateTimeField(db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'password_reset_otps'
        ordering = ['-created_at']

    def __str__(self):
        return f"OTP for {self.email} (expires {self.expires_at})"

    @property
    def is_expired(self):
        return timezone.now() >= self.expires_at


class PendingRegistration(models.Model):
    """Stores signup payload + 6-digit OTP until email is verified. Deleted after account creation."""
    email = models.EmailField(db_index=True)
    otp = models.CharField(max_length=6)
    expires_at = models.DateTimeField(db_index=True)
    signup_payload = models.JSONField()  # password, username, role, first_name, last_name, ...
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'pending_registrations'
        ordering = ['-created_at']

    def __str__(self):
        return f"Pending signup {self.email} (expires {self.expires_at})"

    @property
    def is_expired(self):
        return timezone.now() >= self.expires_at
