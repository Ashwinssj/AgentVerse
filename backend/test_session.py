import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'agentverse.settings')
django.setup()

from django.contrib.auth import get_user_model
from agents.models import Agent
from chat_sessions.models import Session, Turn

User = get_user_model()
user = User.objects.get(username='testuser')
agent = Agent.objects.get(name='Debater')

# Create session
try:
    session = Session.objects.create(user=user)
    session.agents.add(agent)
    print(f"Session created: {session.id}")
    
    # Create turn
    turn = Turn.objects.create(
        session=session,
        agent=agent,
        prompt="Hello",
        response="Hi there!"
    )
    print(f"Turn created: {turn.id}")
    
    # Verify
    assert session.turns.count() == 1
    print("Verification Successful!")
except Exception as e:
    print(f"Error: {e}")
