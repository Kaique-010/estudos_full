package models

import "time"

type Cliente struct {
    ID        int64     `json:"id"`
    Nome      string    `json:"nome"`
    Documento string    `json:"documento"`
    Email     string    `json:"email"`
    Telefone  string    `json:"telefone"`
    Ativo     bool      `json:"ativo"`
    CEP       string    `json:"cep"`
    Endereco  string    `json:"endereco"`
    Numero    string    `json:"numero"`
    Cidade    string    `json:"cidade"`
    Estado    string    `json:"estado"`
    CriadoEm  time.Time `json:"criado_em"`
}
