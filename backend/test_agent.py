import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'agentverse.settings')
django.setup()

from django.contrib.auth import get_user_model
from agents.models import Agent

User = get_user_model()
user = User.objects.get(username='testuser')

# Create agent
try:
    agent = Agent.objects.create(
        user=user,
        name='Debater',
        system_message='You are a skilled debater.',
        provider='OPENAI',
        model='gpt-4'
    )
    print(f"Agent created: {agent.name} ({agent.model})")
    
    # Retrieve
    retrieved_agent = Agent.objects.get(name='Debater')
    assert retrieved_agent.system_message == 'You are a skilled debater.'
    print("Verification Successful!")
except Exception as e:
    print(f"Error: {e}")
