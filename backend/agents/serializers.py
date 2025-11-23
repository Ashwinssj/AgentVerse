from rest_framework import serializers
from .models import Agent

class AgentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Agent
        fields = ('id', 'name', 'system_message', 'provider', 'model', 'web_search_enabled', 'created_at')
        read_only_fields = ('created_at',)

    def create(self, validated_data):
        return Agent.objects.create(**validated_data)
