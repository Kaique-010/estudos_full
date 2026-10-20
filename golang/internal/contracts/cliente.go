package contracts

type ClienteCreateRequest struct {
	Nome      string `json:"nome" validate:"required,min=2,max=150"`
	Documento string `json:"documento" validate:"required,min=11,max=18"`
	Email     string `json:"email" validate:"required,email,max=254"`
	Telefone  string `json:"telefone" validate:"required,min=8,max=20"`
	CEP       string `json:"cep" validate:"required,min=8,max=9"`
	Endereco  string `json:"endereco" validate:"required,min=2,max=200"`
	Cidade    string `json:"cidade" validate:"required,min=2,max=100"`
	Estado    string `json:"estado" validate:"required,min=2,max=100"`
	Numero    string `json:"numero" validate:"required,min=1,max=20"`
}

type ClienteUpdateRequest struct {
	Nome      *string `json:"nome" validate:"omitempty,min=2,max=150"`
	Documento *string `json:"documento" validate:"omitempty,min=11,max=18"`
	Email     *string `json:"email" validate:"omitempty,email,max=254"`
	Telefone  *string `json:"telefone" validate:"omitempty,min=8,max=20"`
	Ativo     *bool   `json:"ativo"`
	CEP       *string `json:"cep" validate:"omitempty,min=8,max=9"`
	Endereco  *string `json:"endereco" validate:"omitempty,min=2,max=200"`
	Cidade    *string `json:"cidade" validate:"omitempty,min=2,max=100"`
	Estado    *string `json:"estado" validate:"omitempty,min=2,max=100"`
	Numero    *string `json:"numero" validate:"omitempty,min=1,max=20"`
}