import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'agentverse.settings')
django.setup()

from django.contrib.auth import get_user_model
User = get_user_model()

try:
    user = User.objects.create_user(username='testuser', email='test@example.com', password='password123')
    print(f"User created: {user.username}, Plan: {user.plan}, Verified: {user.verified}")
except Exception as e:
    print(f"Error: {e}")
