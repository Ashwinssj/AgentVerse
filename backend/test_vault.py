import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'agentverse.settings')
django.setup()

from django.contrib.auth import get_user_model
from vault.models import Credential

User = get_user_model()
user = User.objects.get(username='testuser')

# Create credential
try:
    cred = Credential.objects.create(user=user, provider='OPENAI')
    cred.set_key('sk-test-key-123')
    cred.save()
    print(f"Credential created for {cred.provider}")
    
    # Retrieve and decrypt
    retrieved_cred = Credential.objects.get(user=user, provider='OPENAI')
    decrypted_key = retrieved_cred.get_key()
    print(f"Decrypted Key: {decrypted_key}")
    
    assert decrypted_key == 'sk-test-key-123'
    print("Verification Successful!")
except Exception as e:
    print(f"Error: {e}")
