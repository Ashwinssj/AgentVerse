from rest_framework import serializers
from .models import Session, Turn
from agents.serializers import AgentSerializer

class TurnSerializer(serializers.ModelSerializer):
    agent_name = serializers.CharField(source='agent.name', read_only=True)

    class Meta:
        model = Turn
        fields = ('id', 'agent', 'agent_name', 'prompt', 'response', 'created_at')

class SessionSerializer(serializers.ModelSerializer):
    turns = TurnSerializer(many=True, read_only=True)
    agent_ids = serializers.ListField(
        child=serializers.IntegerField(), write_only=True
    )
    agents = AgentSerializer(many=True, read_only=True)

    class Meta:
        model = Session
        fields = ('id', 'status', 'agents', 'agent_ids', 'turns', 'created_at', 'topic', 'max_turns')
        read_only_fields = ('status', 'created_at')

    def create(self, validated_data):
        agent_ids = validated_data.pop('agent_ids')
        session = Session.objects.create(**validated_data)
        session.agents.set(agent_ids)
        return session
