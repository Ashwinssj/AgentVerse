from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User
from agents.models import Agent
from chat_sessions.models import Session

class AgentInline(admin.TabularInline):
    model = Agent
    extra = 0
    readonly_fields = ('created_at',)
    show_change_link = True

class SessionInline(admin.TabularInline):
    model = Session
    extra = 0
    readonly_fields = ('created_at',)
    show_change_link = True

class CustomUserAdmin(UserAdmin):
    inlines = [AgentInline, SessionInline]
    list_display = UserAdmin.list_display + ('plan', 'verified')
    list_filter = UserAdmin.list_filter + ('plan', 'verified')
    fieldsets = UserAdmin.fieldsets + (
        ('Subscription Info', {'fields': ('plan', 'verified')}),
    )

admin.site.register(User, CustomUserAdmin)
