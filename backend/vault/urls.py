from django.urls import path
from .views import CredentialListCreateView, CredentialDetailView

urlpatterns = [
    path('credentials/', CredentialListCreateView.as_view(), name='credential-list-create'),
    path('credentials/<int:pk>/', CredentialDetailView.as_view(), name='credential-detail'),
]
