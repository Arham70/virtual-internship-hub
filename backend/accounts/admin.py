from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, StudentProfile, MentorProfile, Domain

@admin.register(Domain)
class DomainAdmin(admin.ModelAdmin):
    list_display = ('name', 'code', 'created_at')
    search_fields = ('name', 'code')
    ordering = ('name',)

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ('username', 'email', 'role', 'is_active', 'created_at')
    list_filter = ('role', 'is_active', 'is_staff', 'created_at')
    search_fields = ('username', 'email')
    ordering = ('-created_at',)
    
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Role Information', {'fields': ('role',)}),
    )

@admin.register(StudentProfile)
class StudentProfileAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'last_name', 'user', 'current_skill_level', 'created_at')
    list_filter = ('current_skill_level', 'created_at')
    search_fields = ('first_name', 'last_name', 'user__username', 'user__email')
    filter_horizontal = ('target_domains',)
    readonly_fields = ('created_at', 'updated_at')

@admin.register(MentorProfile)
class MentorProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'expertise_domain', 'years_of_experience', 'is_available')
    list_filter = ('is_available', 'expertise_domain', 'years_of_experience', 'created_at')
    search_fields = ('user__username', 'user__email', 'professional_bio')
    readonly_fields = ('created_at', 'updated_at')

