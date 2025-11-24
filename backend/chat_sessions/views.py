from rest_framework import generics, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Session, Turn
from .serializers import SessionSerializer, TurnSerializer
from agents.models import Agent
from vault.models import Credential
from core.providers import ProviderFactory
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView

class SessionListCreateView(generics.ListCreateAPIView):
    serializer_class = SessionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Session.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class SessionDetailView(generics.RetrieveAPIView):
    serializer_class = SessionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Session.objects.filter(user=self.request.user)

class SessionStartView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        session = get_object_or_404(Session, pk=pk, user=request.user)
        session.status = 'ACTIVE'
        session.save()
        return Response({'status': 'Session started'})

class SessionStopView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        session = get_object_or_404(Session, pk=pk, user=request.user)
        session.status = 'COMPLETED'
        session.save()
        return Response({'status': 'Session stopped'})

class GenerateSummaryView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        session = get_object_or_404(Session, pk=pk, user=request.user)
        
        if not session.turns.exists():
            return Response({
                'error': 'No conversation to summarize'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Build conversation text
        conversation = []
        for turn in session.turns.all():
            conversation.append(f"{turn.agent.name}: {turn.response}")
        
        conversation_text = "\n\n".join(conversation)
        
        # Generate summary using the first agent's provider
        try:
            first_agent = session.agents.first()
            credential = Credential.objects.filter(user=request.user, provider=first_agent.provider).first()
            
            if not credential:
                return Response({
                    'summary': f"Session Summary:\n\nTopic: {session.topic}\nTotal Turns: {session.turns.count()}\n\nThis session contains {session.turns.count()} conversation turns. To generate an AI-powered summary, please add an API key for {first_agent.provider} in the Vault."
                })
            
            api_key = credential.get_key()
            provider = ProviderFactory.get_provider(first_agent.provider)
            
            summary_prompt = f"Please provide a concise summary of the following conversation:\n\n{conversation_text[:3000]}"
            
            summary = provider.generate_response(
                system_message="You are a helpful assistant that creates concise summaries.",
                prompt=summary_prompt,
                api_key=api_key,
                model=first_agent.model
            )
            
            return Response({'summary': summary})
            
        except Exception as e:
            return Response({
                'summary': f"Session Summary:\n\nTopic: {session.topic}\nTotal Turns: {session.turns.count()}\n\nKey participants: {', '.join([a.name for a in session.agents.all()])}"
            })

class ExportPDFView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        from django.http import HttpResponse
        
        session = get_object_or_404(Session, pk=pk, user=request.user)
        
        # For now, return a simple text file (PDF generation requires additional library)
        response = HttpResponse(content_type='text/plain')
        response['Content-Disposition'] = f'attachment; filename="session-{pk}-transcript.txt"'
        
        # Build transcript
        transcript = f"AgentVerse Session Transcript\n"
        transcript += f"=" * 50 + "\n\n"
        transcript += f"Session ID: {session.id}\n"
        transcript += f"Topic: {session.topic}\n"
        transcript += f"Created: {session.created_at.strftime('%Y-%m-%d %H:%M:%S')}\n"
        transcript += f"Participants: {', '.join([a.name for a in session.agents.all()])}\n"
        transcript += f"\n" + "=" * 50 + "\n\n"
        
        for i, turn in enumerate(session.turns.all(), 1):
            transcript += f"Turn {i} - {turn.agent.name}\n"
            transcript += f"{'-' * 50}\n"
            transcript += f"Time: {turn.created_at.strftime('%Y-%m-%d %H:%M:%S')}\n\n"
            transcript += f"{turn.response}\n\n"
            transcript += f"{'=' * 50}\n\n"
        
        response.write(transcript)
        return response

class GenerateReportView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        session = get_object_or_404(Session, pk=pk, user=request.user)
        
        if not session.turns.exists():
            return Response({
                'error': 'No conversation to analyze'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Generate report using utility function
        from .utils import generate_session_report
        report = generate_session_report(session)
        
        return Response({'report': report})

class InjectPromptView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        session = get_object_or_404(Session, pk=pk, user=request.user)
        prompt = request.data.get('prompt', '')
        
        if not prompt:
            return Response({'error': 'Prompt is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        if session.status != 'ACTIVE':
            return Response({'error': 'Session is not active'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if max turns reached
        if session.turns.count() >= session.max_turns:
            session.status = 'COMPLETED'
            session.save()
            return Response({'error': 'Max turns reached'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Get all agents in the session
        agents = session.agents.all()
        if not agents:
            return Response({'error': 'No agents in session'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Continue conversation until conclusion or max turns
        conversation_active = True
        initial_prompt = prompt
        
        while conversation_active and session.turns.count() < session.max_turns:
            # For each agent, generate a response
            for agent in agents:
                # Check turn limit
                if session.turns.count() >= session.max_turns:
                    session.status = 'COMPLETED'
                    session.save()
                    conversation_active = False
                    break
                
                try:
                    # Get API key for this agent's provider
                    credential = Credential.objects.filter(user=request.user, provider=agent.provider).first()
                    if not credential:
                        return Response({
                            'error': f'No API key found for {agent.provider}. Please add one in the Vault.'
                        }, status=status.HTTP_400_BAD_REQUEST)
                    
                    api_key = credential.get_key()
                    provider = ProviderFactory.get_provider(agent.provider)
                    
                    # Build conversation history
                    conversation_context = ""
                    for turn in session.turns.all():
                        conversation_context += f"{turn.agent.name}: {turn.response}\n\n"
                    
                    # For the first turn, use the user's prompt
                    # For subsequent turns, use the conversation context
                    if session.turns.count() == 0:
                        full_prompt = f"User: {initial_prompt}"
                    else:
                        full_prompt = conversation_context
                    
                    # Enhanced system message for autonomous conversation
                    enhanced_system_message = f"""{agent.system_message}

IMPORTANT INSTRUCTIONS FOR MULTI-AGENT CONVERSATION:
- You are in a conversation with other agents: {', '.join([a.name for a in agents if a.id != agent.id])}
- Respond naturally to the previous messages in the conversation
- Build upon what others have said
- If you feel the discussion has reached a natural conclusion, end your response with the phrase: "[CONVERSATION_CONCLUDED]"
- If there's more to discuss, continue the dialogue
- Be concise but meaningful in your responses
"""
                    
                    # Generate response
                    response_text = provider.generate_response(
                        system_message=enhanced_system_message,
                        prompt=full_prompt,
                        api_key=api_key,
                        model=agent.model
                    )
                    
                    # Create turn
                    Turn.objects.create(
                        session=session,
                        agent=agent,
                        prompt=initial_prompt if session.turns.count() == 0 else "",
                        response=response_text,
                        token_count=0
                    )
                    
                    # Check if agent concluded the conversation
                    if "[CONVERSATION_CONCLUDED]" in response_text:
                        conversation_active = False
                        # Remove the marker from the response
                        last_turn = session.turns.last()
                        last_turn.response = response_text.replace("[CONVERSATION_CONCLUDED]", "").strip()
                        last_turn.save()
                        break
                    
                except Exception as e:
                    return Response({
                        'error': f'Failed to generate response from {agent.name}: {str(e)}'
                    }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
            # After one full round, check if we should continue
            # If no agent concluded, continue for another round
            if conversation_active and session.turns.count() < session.max_turns:
                # Check if we've had at least 2 rounds (all agents spoke twice)
                turns_per_agent = session.turns.count() / len(agents)
                if turns_per_agent >= 3:  # After 3 rounds, stop automatically
                    conversation_active = False
        
        # Refresh session data
        session.refresh_from_db()
        serializer = SessionSerializer(session)
        return Response(serializer.data)
