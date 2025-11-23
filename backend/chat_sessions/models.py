from django.db import models
from django.conf import settings
from agents.models import Agent

class Session(models.Model):
    STATUS_CHOICES = [
        ('ACTIVE', 'Active'),
        ('COMPLETED', 'Completed'),
        ('ERROR', 'Error'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='sessions')
    agents = models.ManyToManyField(Agent, related_name='sessions')
    topic = models.CharField(max_length=255, default="General Discussion")
    max_turns = models.IntegerField(default=10)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='ACTIVE')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Session {self.id} - {self.status}"

class Turn(models.Model):
    session = models.ForeignKey(Session, on_delete=models.CASCADE, related_name='turns')
    agent = models.ForeignKey(Agent, on_delete=models.CASCADE, related_name='turns')
    prompt = models.TextField()
    response = models.TextField()
    token_count = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f"Turn {self.id} - {self.agent.name}"
