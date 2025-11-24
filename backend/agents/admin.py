from django.contrib import admin
from .models import Agent

@admin.register(Agent)
class AgentAdmin(admin.ModelAdmin):
    list_display = ('name', 'provider', 'model', 'user', 'created_at')
    list_filter = ('provider', 'user')
    search_fields = ('name', 'system_message')
