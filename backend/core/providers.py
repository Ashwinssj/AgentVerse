import abc
import openai
import google.generativeai as genai
from django.conf import settings

class LLMProvider(abc.ABC):
    @abc.abstractmethod
    def generate_response(self, system_message, prompt, api_key, model):
        pass

class OpenAIProvider(LLMProvider):
    def generate_response(self, system_message, prompt, api_key, model):
        client = openai.OpenAI(api_key=api_key)
        response = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": system_message},
                {"role": "user", "content": prompt}
            ]
        )
        return response.choices[0].message.content

class GeminiProvider(LLMProvider):
    def generate_response(self, system_message, prompt, api_key, model):
        genai.configure(api_key=api_key)
        model_instance = genai.GenerativeModel(model)
        # Gemini doesn't have a direct "system" role in the same way, usually prepended
        full_prompt = f"System: {system_message}\nUser: {prompt}"
        response = model_instance.generate_content(full_prompt)
        return response.text

class MockProvider(LLMProvider):
    def generate_response(self, system_message, prompt, api_key, model):
        return f"Mock response to: {prompt} (Model: {model})"

class ProviderFactory:
    @staticmethod
    def get_provider(provider_name):
        if provider_name == 'OPENAI':
            return OpenAIProvider()
        elif provider_name == 'GEMINI':
            return GeminiProvider()
        else:
            return MockProvider()
