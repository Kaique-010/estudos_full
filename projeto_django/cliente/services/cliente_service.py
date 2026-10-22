
import re
from django.db import transaction
from cliente.models import Cliente
from django.db.models import Q
from django.utils.dateparse import parse_date
from rest_framework.exceptions import ValidationError


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
    def listar_todos(
        busca=None,
        data_inicio=None,
        data_fim=None,
        ordenacao="id",
    ):
        queryset = Cliente.objects.all()

        # Busca textual
        if busca:
            queryset = queryset.filter(
                Q(nome__icontains=busca)
                | Q(documento__icontains=busca)
                | Q(email__icontains=busca)
                | Q(telefone__icontains=busca)
            )

        # Validação das datas
        inicio = ClienteService._validar_data(
            data_inicio, "data_inicio"
        )
        fim = ClienteService._validar_data(
            data_fim, "data_fim"
        )

        if inicio and fim and inicio > fim:
            raise ValidationError({
                "periodo": "data_inicio não pode ser posterior a data_fim."
            })

        if inicio:
            queryset = queryset.filter(criado_em__date__gte=inicio)

        if fim:
            queryset = queryset.filter(criado_em__date__lte=fim)

        # Ordenação permitida
        campos_permitidos = {
            "id",
            "nome",
            "documento",
            "email",
            "criado_em",
            "atualizado_em",
            "ativo",
        }

        campo = ordenacao.removeprefix("-")

        if campo not in campos_permitidos:
            raise ValidationError({
                "ordenacao": "Campo de ordenação inválido."
            })

        return queryset.order_by(ordenacao)
    
    @staticmethod
    def buscar_por_id(id: int, ativo: bool = True) -> Cliente:
        return Cliente.objects.get(
            id=id,
            ativo=ativo,
        )
        
        
    @staticmethod
    def _validar_data(valor, campo):
        if not valor:
            return None

        data = parse_date(valor)

        if data is None:
            raise ValidationError({
                campo: "Informe uma data no formato YYYY-MM-DD."
            })

        return data