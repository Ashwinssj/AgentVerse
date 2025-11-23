from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    PLAN_CHOICES = [
        ('BASIC', 'Basic'),
        ('PRO', 'Pro'),
        ('PREMIUM', 'Premium'),
    ]
    
    plan = models.CharField(max_length=10, choices=PLAN_CHOICES, default='BASIC')
    verified = models.BooleanField(default=False)

    def __str__(self):
        return self.email

