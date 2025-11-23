from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import authenticate, login
from .serializers import RegisterSerializer, UserSerializer

class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

from rest_framework.authtoken.models import Token

class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)
        if user:
            login(request, user)
            token, created = Token.objects.get_or_create(user=user)
            return Response({
                'token': token.key,
                'user': UserSerializer(user).data
            })
        return Response({'error': 'Invalid Credentials'}, status=status.HTTP_400_BAD_REQUEST)

class UserDetailView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user
