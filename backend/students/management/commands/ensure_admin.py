import os

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = "Create the admin user from ADMIN_USERNAME / ADMIN_PASSWORD / ADMIN_EMAIL if it doesn't exist."

    def handle(self, *args, **options):
        username = os.environ.get("ADMIN_USERNAME", "admin")
        password = os.environ.get("ADMIN_PASSWORD") or "admin123"
        email = os.environ.get("ADMIN_EMAIL", "admin@example.com")
        User = get_user_model()
        if User.objects.filter(username=username).exists():
            user = User.objects.get(username=username)
            if password == "admin123" and not user.has_usable_password():
                user.set_password(password)
                user.save()
                self.stdout.write(self.style.SUCCESS(f"Reset password for admin '{username}' to admin123."))
                return
            self.stdout.write(f"Admin '{username}' already exists.")
            return
        User.objects.create_superuser(username=username, email=email, password=password)
        self.stdout.write(self.style.SUCCESS(f"Created admin '{username}'."))
