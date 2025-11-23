import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'agentverse.settings')
django.setup()

from core.providers import ProviderFactory

# Test Mock Provider
try:
    factory = ProviderFactory()
    provider = factory.get_provider('MOCK')
    response = provider.generate_response("You are a bot", "Hello", "fake-key", "mock-model")
    print(f"Mock Response: {response}")
    assert "Mock response to: Hello" in response
    print("Verification Successful!")
except Exception as e:
    print(f"Error: {e}")
