from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator
from datetime import datetime



class ClienteBase(BaseModel):
    nome: str = Field(..., description="Nome do cliente", min_length=3, max_length=150)
    documento: str = Field(..., description="CPF ou CNPJ do cliente", min_length=11, max_length=15)
    email: EmailStr = Field(..., description="Email do cliente")
    telefone: str = Field(..., description="Telefone do cliente", min_length=10, max_length=20)
    ativo: bool = Field(default=True, description="Se o cliente está ativo")
    cep: str = Field(..., description="CEP do cliente")
    endereco: str = Field(..., description="Endereço do cliente")
    numero: str = Field(..., description="Número do endereço do cliente")
    cidade: str | None = Field(default=None, description="Cidade do cliente")
    estado: str | None = Field(default=None, description="Estado do cliente", min_length=0, max_length=2)

class ClienteCreate(ClienteBase):
    pass



class ClienteUpdate(BaseModel):
    nome: str | None = Field(default=None, min_length=2, max_length=150)
    documento: str | None = Field(default=None, min_length=11, max_length=18)
    email: EmailStr | None = None
    telefone: str | None = Field(default=None, min_length=8, max_length=20)
    ativo: bool | None = None
    cep: str | None = Field(default=None, min_length=8, max_length=10)
    endereco: str | None = Field(default=None, min_length=2, max_length=200)
    numero: str | None = Field(default=None, min_length=1, max_length=20)
    cidade: str | None = Field(default=None, description="Cidade do cliente", min_length=0, max_length=100)
    estado: str | None = Field(default=None, description="Estado do cliente", min_length=0, max_length=2)
    

    @field_validator(
        "nome",
        "documento",
        "email",
        "telefone",
        "ativo",
        "cep",
        "endereco",
        "numero",
        "cidade",
        "estado",
        mode="before"
    )
    @classmethod
    def validar_campos_nao_nulos(cls, valor):
        if valor is None:
            return ""
        return valor
        

class ClienteResponse(ClienteBase):
    id: int
    criado_em: datetime
    atualizado_em: datetime

    model_config = ConfigDict(from_attributes=True)