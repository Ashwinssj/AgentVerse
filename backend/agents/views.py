from rest_framework import generics, permissions
from .models import Agent
from .serializers import AgentSerializer

class AgentListCreateView(generics.ListCreateAPIView):
    serializer_class = AgentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Agent.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class AgentDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = AgentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Agent.objects.filter(user=self.request.user)
