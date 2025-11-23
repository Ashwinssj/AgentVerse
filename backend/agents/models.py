from django.db import models
from django.conf import settings

class Agent(models.Model):
    PROVIDER_CHOICES = [
        ('OPENAI', 'OpenAI'),
        ('CLAUDE', 'Anthropic Claude'),
        ('GEMINI', 'Google Gemini'),
    ]
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='agents')
    name = models.CharField(max_length=100)
    provider = models.CharField(max_length=20, choices=PROVIDER_CHOICES)
    model = models.CharField(max_length=100)
    system_message = models.TextField()
    web_search_enabled = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.name} ({self.provider})"
