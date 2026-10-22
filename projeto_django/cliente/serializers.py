from django.db import models
from rest_framework import serializers
from .models import Cliente
from .services.cliente_service import ClienteService

class ClienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cliente
        fields = '__all__'
        read_only_fields = ['id', "criado_em", "atualizado_em"]
        
        def validar_documento(self, value: str) -> str:
            return ClienteService.validar_documento(value)
        
        def create(self, validated_data: dict) -> Cliente:
            return ClienteService.criar_cliente(validated_data)
        
        def update(self, instance: Cliente, validated_data: dict) -> Cliente:
            return ClienteService.atualizar_cliente(instance, validated_data)