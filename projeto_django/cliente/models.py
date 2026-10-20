from django.db import models


class Cliente(models.Model):
    nome = models.CharField(max_length=100)
    documento = models.CharField(max_length=15, unique=True)
    email = models.EmailField()
    telefone = models.CharField(max_length=15)
    ativo = models.BooleanField(default=True)
    cep = models.CharField(max_length=10)
    endereco = models.CharField(max_length=200)
    numero = models.CharField(max_length=10)
    cidade = models.CharField(max_length=100)
    estado = models.CharField(max_length=2)
    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'cliente'
        verbose_name = 'Cliente'
        verbose_name_plural = 'Clientes'
        ordering = ['id']
    
    def __str__(self):
        return f'{self.nome} - {self.documento}'
