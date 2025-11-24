from django.contrib import admin
from django.utils.html import mark_safe
import markdown
from .models import Session, Turn
from .utils import generate_session_report

class TurnInline(admin.TabularInline):
    model = Turn
    extra = 0
    readonly_fields = ('created_at', 'formatted_response')
    fields = ('agent', 'formatted_response', 'created_at')
    
    def formatted_response(self, obj):
        return mark_safe(markdown.markdown(obj.response))
    formatted_response.short_description = "Response"

@admin.register(Session)
class SessionAdmin(admin.ModelAdmin):
    list_display = ('id', 'topic', 'user', 'status', 'created_at')
    list_filter = ('status', 'user')
    search_fields = ('topic',)
    inlines = [TurnInline]
    readonly_fields = ('formatted_report',)
    
    def formatted_report(self, obj):
        report_md = generate_session_report(obj)
        return mark_safe(markdown.markdown(report_md))
    formatted_report.short_description = "Session Analysis Report"

@admin.register(Turn)
class TurnAdmin(admin.ModelAdmin):
    list_display = ('session', 'agent', 'created_at')
    list_filter = ('agent', 'session')
    readonly_fields = ('formatted_response',)
    
    def formatted_response(self, obj):
        return mark_safe(markdown.markdown(obj.response))
    formatted_response.short_description = "Response (Formatted)"
