"""
Create an admin (superuser) for the Virtual Internship Hub.
Usage: python manage.py create_admin
Prompts for email, username, and password.
"""
from django.core.management.base import BaseCommand
from django.core.management import call_command
from accounts.models import User


class Command(BaseCommand):
    help = 'Create an admin (superuser) for the site. Prompts for email, username, password.'

    def add_arguments(self, parser):
        parser.add_argument('--email', type=str, help='Admin email')
        parser.add_argument('--username', type=str, help='Admin username')
        parser.add_argument('--password', type=str, help='Admin password (min 8 chars)')
        parser.add_argument('--noinput', action='store_true', help='Do not prompt; require --email, --username, --password')

    def handle(self, *args, **options):
        email = options.get('email') or input('Email: ').strip()
        username = options.get('username') or input('Username: ').strip()
        password = options.get('password')
        if not password:
            from getpass import getpass
            password = getpass('Password: ')
            password_confirm = getpass('Password (again): ')
            if password != password_confirm:
                self.stderr.write(self.style.ERROR('Passwords do not match.'))
                return
        if not email or not username:
            self.stderr.write(self.style.ERROR('Email and username are required.'))
            return
        if len(password) < 8:
            self.stderr.write(self.style.ERROR('Password must be at least 8 characters.'))
            return
        if User.objects.filter(email=email).exists():
            self.stderr.write(self.style.ERROR(f'User with email "{email}" already exists.'))
            return
        if User.objects.filter(username=username).exists():
            self.stderr.write(self.style.ERROR(f'User with username "{username}" already exists.'))
            return
        user = User.objects.create_superuser(email=email, username=username, password=password)
        self.stdout.write(self.style.SUCCESS(f'Admin created: {user.email} (username: {user.username})'))
        self.stdout.write(self.style.SUCCESS('Log in at: /admin/'))
