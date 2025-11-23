from rest_framework import serializers
from .models import Credential

class CredentialSerializer(serializers.ModelSerializer):
    api_key = serializers.CharField(write_only=True)

    class Meta:
        model = Credential
        fields = ('id', 'provider', 'api_key', 'name', 'created_at')
        read_only_fields = ('created_at',)

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        # Add decrypted key for display (only when retrieving)
        representation['encrypted_key'] = instance.get_key()
        return representation

    def create(self, validated_data):
        api_key = validated_data.pop('api_key')
        credential = Credential(**validated_data)
        credential.set_key(api_key)
        credential.save()
        return credential

    def update(self, instance, validated_data):
        if 'api_key' in validated_data:
            api_key = validated_data.pop('api_key')
            instance.set_key(api_key)
        return super().update(instance, validated_data)
