
import re

from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.models.cliente import Cliente
from app.schemas.cliente import ClienteCreate, ClienteUpdate

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
    def criar_cliente(dados: ClienteCreate, db: Session) -> Cliente:
        documento = ClienteService.validar_documento(dados.documento)

        existente = db.scalar(
            select(Cliente).where(Cliente.documento == documento)
        )

        if existente:
            raise ValueError("Já existe um cliente com esse documento.")

        cliente = Cliente(
            **dados.model_dump(exclude={"documento"}),
            documento=documento,
        )

        try:
            db.add(cliente)
            db.commit()
            db.refresh(cliente)
            return cliente

        except IntegrityError as erro:
            db.rollback()
            raise ValueError(
                "Não foi possível cadastrar o cliente. "
                "Verifique se o documento já está cadastrado."
            ) from erro

    
    @staticmethod
    def atualizar_cliente(
        dados: ClienteUpdate,
        db: Session,
        cliente: Cliente,
    ) -> Cliente:
        campos = dados.model_dump(exclude_unset=True)

        if "documento" in campos:
            campos["documento"] = ClienteService.validar_documento(
                campos["documento"]
            )

        for campo, valor in campos.items():
            setattr(cliente, campo, valor)

        try:
            db.commit()
            db.refresh(cliente)
            return cliente

        except IntegrityError as erro:
            db.rollback()
            raise ValueError(
                "Não foi possível atualizar o cliente. "
                "Verifique se o documento já está cadastrado."
            ) from erro


    @staticmethod
    def deletar_cliente(db: Session, cliente: Cliente) -> None:
        db.delete(cliente)
        db.commit()
    
    @staticmethod
    def listar_clientes(db: Session) -> list[Cliente]:
        return db.scalars(select(Cliente)).all()
    
    @staticmethod
    def buscar_cliente_por_id(db: Session, cliente_id: int) -> Cliente:
        cliente = db.get(Cliente, cliente_id)
        if not cliente:
            raise ValueError("Cliente não encontrado.")
        return cliente
