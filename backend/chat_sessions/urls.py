from django.urls import path
from .views import (
    SessionListCreateView, 
    SessionDetailView, 
    SessionStartView, 
    SessionStopView, 
    InjectPromptView,
    GenerateSummaryView,
    ExportPDFView,
    GenerateReportView
)

urlpatterns = [
    path('', SessionListCreateView.as_view(), name='session-list-create'),
    path('<int:pk>/', SessionDetailView.as_view(), name='session-detail'),
    path('<int:pk>/start/', SessionStartView.as_view(), name='session-start'),
    path('<int:pk>/stop/', SessionStopView.as_view(), name='session-stop'),
    path('<int:pk>/inject/', InjectPromptView.as_view(), name='session-inject'),
    path('<int:pk>/generate-summary/', GenerateSummaryView.as_view(), name='session-generate-summary'),
    path('<int:pk>/export-pdf/', ExportPDFView.as_view(), name='session-export-pdf'),
    path('<int:pk>/generate-report/', GenerateReportView.as_view(), name='session-generate-report'),
]
