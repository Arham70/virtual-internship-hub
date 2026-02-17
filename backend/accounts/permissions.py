from rest_framework import permissions

class IsStudent(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_student

class IsMentor(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_mentor

class IsAdministrator(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_administrator


class IsSuperuser(permissions.BasePermission):
    """Only superusers (Django admin) can access."""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_superuser


