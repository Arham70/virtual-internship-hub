from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, StudentProfile, MentorProfile, Domain, PasswordResetOTP, PendingRegistration


def only_superuser_can_delete(model_admin, request, obj=None):
    """Only superadmin (is_superuser) can delete users and profiles."""
    return request.user.is_superuser


@admin.register(Domain)
class DomainAdmin(admin.ModelAdmin):
    list_display = ('name', 'code', 'created_at')
    search_fields = ('name', 'code')
    ordering = ('name',)


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ('username', 'email', 'role', 'is_email_verified', 'is_staff', 'is_superuser', 'is_active', 'created_at')
    list_filter = ('role', 'is_active', 'is_email_verified', 'is_staff', 'is_superuser', 'created_at')
    search_fields = ('username', 'email')
    ordering = ('-created_at',)

    # Custom User has no first_name, last_name, date_joined – override fieldsets completely
    fieldsets = (
        (None, {'fields': ('email', 'username', 'password')}),
        ('Role & verification', {'fields': ('role', 'is_email_verified')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser')}),
        ('Important dates', {'fields': ('created_at',)}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'username', 'password1', 'password2'),
        }),
        ('Role & verification', {'fields': ('role', 'is_email_verified')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser')}),
    )
    readonly_fields = ('created_at',)

    def has_delete_permission(self, request, obj=None):
        return only_superuser_can_delete(self, request, obj)

    def get_actions(self, request):
        actions = super().get_actions(request)
        if not request.user.is_superuser and 'delete_selected' in actions:
            del actions['delete_selected']
        return actions


@admin.register(StudentProfile)
class StudentProfileAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'last_name', 'user', 'current_skill_level', 'created_at')
    list_filter = ('current_skill_level', 'created_at')
    search_fields = ('first_name', 'last_name', 'user__username', 'user__email')
    filter_horizontal = ('target_domains',)
    readonly_fields = ('created_at', 'updated_at')

    def has_delete_permission(self, request, obj=None):
        return only_superuser_can_delete(self, request, obj)

    def get_actions(self, request):
        actions = super().get_actions(request)
        if not request.user.is_superuser and 'delete_selected' in actions:
            del actions['delete_selected']
        return actions


@admin.register(MentorProfile)
class MentorProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'expertise_domain', 'years_of_experience', 'is_available')
    list_filter = ('is_available', 'expertise_domain', 'years_of_experience', 'created_at')
    search_fields = ('user__username', 'user__email', 'professional_bio')
    readonly_fields = ('created_at', 'updated_at')

    def has_delete_permission(self, request, obj=None):
        return only_superuser_can_delete(self, request, obj)

    def get_actions(self, request):
        actions = super().get_actions(request)
        if not request.user.is_superuser and 'delete_selected' in actions:
            del actions['delete_selected']
        return actions


@admin.register(PasswordResetOTP)
class PasswordResetOTPAdmin(admin.ModelAdmin):
    list_display = ('email', 'otp', 'expires_at', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('email',)
    readonly_fields = ('created_at',)


@admin.register(PendingRegistration)
class PendingRegistrationAdmin(admin.ModelAdmin):
    list_display = ('email', 'otp', 'expires_at', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('email',)
    readonly_fields = ('created_at', 'signup_payload')

