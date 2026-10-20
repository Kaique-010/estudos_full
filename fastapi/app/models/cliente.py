from sqlalchemy import Boolean, String, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column
from datetime import datetime

from app.database import Base

class Cliente(Base):
    __tablename__ = "cliente"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    nome: Mapped[str] = mapped_column(String(100), nullable=False)
    documento: Mapped[str] = mapped_column(
        String(15),
        unique=True,
        index=True,
        nullable=False,
    )
    email: Mapped[str] = mapped_column(String(254), nullable=False)
    telefone: Mapped[str] = mapped_column(String(15), nullable=False)

    ativo: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    cep: Mapped[str] = mapped_column(String(10), nullable=False)
    endereco: Mapped[str] = mapped_column(String(200), nullable=False)
    numero: Mapped[str] = mapped_column(String(10), nullable=False)
    cidade: Mapped[str] = mapped_column(String(100), nullable=False)
    estado: Mapped[str] = mapped_column(String(2), nullable=False)

    criado_em: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    atualizado_em: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )
