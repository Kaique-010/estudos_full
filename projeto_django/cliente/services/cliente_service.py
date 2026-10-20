
import re
from django.db import transaction
from cliente.models import Cliente



class ClienteService:

    @staticmethod
    def validar_documento(documento: str) -> str:
        documento = re.sub(r"\D", "", documento)

        if len(documento) == 11:
            if ClienteService._validar_cpf(documento):
                return documento

        elif len(documento) == 14:
            if ClienteService._validar_cnpj(documento):
                return documento

        raise ValueError("CPF ou CNPJ inválido.")

    @staticmethod
    def _validar_cpf(cpf: str) -> bool:
        if cpf == cpf[0] * len(cpf):
            return False

        for tamanho in (9, 10):
            soma = sum(
                int(digito) * peso
                for digito, peso in zip(
                    cpf[:tamanho],
                    range(tamanho + 1, 1, -1),
                )
            )

            resto = (soma * 10) % 11
            digito = 0 if resto == 10 else resto

            if digito != int(cpf[tamanho]):
                return False

        return True

    @staticmethod
    def _validar_cnpj(cnpj: str) -> bool:
        if cnpj == cnpj[0] * len(cnpj):
            return False

        pesos = (
            (5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2),
            (6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2),
        )

        for indice, sequencia in enumerate(pesos):
            tamanho = 12 + indice
            soma = sum(
                int(digito) * peso
                for digito, peso in zip(cnpj[:tamanho], sequencia)
            )

            resto = soma % 11
            digito = 0 if resto < 2 else 11 - resto

            if digito != int(cnpj[tamanho]):
                return False

        return True

    @staticmethod
    def criar_cliente(dados: dict) -> Cliente:
       dados = dados.copy()
       
       documento = dados.get("documento", "")
       dados["documento"] = ClienteService.validar_documento(documento)
       
       try:
           with transaction.atomic():
               cliente = Cliente.objects.create(**dados)
               return cliente
       except Exception as e:
           raise e
       
    
    @staticmethod
    def atualizar_cliente(cliente: Cliente, dados: dict) -> Cliente:
        dados = dados.copy()

        if "documento" in dados:
            dados["documento"] = ClienteService.validar_documento(
                dados["documento"]
            )

        for campo, valor in dados.items():
            setattr(cliente, campo, valor)

        cliente.save()
        return cliente

    
    @staticmethod
    def listar_todos() -> list:
        return Cliente.objects.all()
    
    @staticmethod
    def buscar_por_id(id: int) -> Cliente:
        return Cliente.objects.get(id=id)