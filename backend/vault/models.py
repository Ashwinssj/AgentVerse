from django.db import models
from django.conf import settings
from cryptography.fernet import Fernet
import base64
import os

class Credential(models.Model):
    PROVIDER_CHOICES = [
        ('OPENAI', 'OpenAI'),
        ('GEMINI', 'Gemini'),
        ('CLAUDE', 'Claude'),
        ('GROQ', 'Groq'),
        ('OPENROUTER', 'OpenRouter'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='credentials')
    provider = models.CharField(max_length=20, choices=PROVIDER_CHOICES)
    encrypted_key = models.TextField()
    name = models.CharField(max_length=100, default="Default Key")
    created_at = models.DateTimeField(auto_now_add=True)

    def set_key(self, key):
        # Use SECRET_KEY to derive a key for Fernet (must be 32 url-safe base64-encoded bytes)
        # For simplicity in this demo, we'll generate a key if not present or use a fixed derivation.
        # Ideally, use a proper KDF. Here we'll just use a separate env var or derive from SECRET_KEY.
        
        # Simple derivation for MVP:
        key_material = settings.SECRET_KEY.encode()[:32].ljust(32, b'0')
        fernet_key = base64.urlsafe_b64encode(key_material)
        f = Fernet(fernet_key)
        self.encrypted_key = f.encrypt(key.encode()).decode()

    def get_key(self):
        key_material = settings.SECRET_KEY.encode()[:32].ljust(32, b'0')
        fernet_key = base64.urlsafe_b64encode(key_material)
        f = Fernet(fernet_key)
        return f.decrypt(self.encrypted_key.encode()).decode()

    def __str__(self):
        return f"{self.provider} - {self.user.email}"
