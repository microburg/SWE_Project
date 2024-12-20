from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from users.models import UserProfile

class Command(BaseCommand):
    help = "Populate UserProfile for all existing users"

    def handle(self, *args, **kwargs):
        for user in User.objects.all():
            if not hasattr(user, 'profile'):
                UserProfile.objects.create(user=user)
                self.stdout.write(self.style.SUCCESS(f"Created profile for user: {user.username}"))
            else:
                self.stdout.write(self.style.WARNING(f"Profile already exists for user: {user.username}"))
