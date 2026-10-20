package services

import (
	"context"
	"errors"
	"regexp"
	"strings"

	"vendas-go/internal/contracts"
	"vendas-go/internal/models"
	"vendas-go/internal/repositories"
)

var (
	ErrDocumentoInvalido  = errors.New("documento inválido")
	ErrCPFInvalido        = errors.New("cpf inválido")
	ErrCNPJInvalido       = errors.New("cnpj inválido")
	ErrEmailInvalido      = errors.New("email inválido")
	ErrDocumentoDuplicado = errors.New("já existe um cliente com esse documento")
)

var (
	naoDigitosRegex = regexp.MustCompile(`\D`)
	emailRegex      = regexp.MustCompile(`^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$`)
)

type ClienteService struct {
	repo *repositories.ClienteRepository
}

func NewClienteService(repo *repositories.ClienteRepository) *ClienteService {
	return &ClienteService{repo: repo}
}



func (s *ClienteService) BuscarTodos(
	ctx context.Context,
) ([]*models.Cliente, error) {
	return s.repo.BuscarTodos(ctx)
}

func (s *ClienteService) BuscarPorDocumento(
	ctx context.Context,
	documento string,
) (*models.Cliente, error) {
	return s.repo.BuscarPorDocumento(ctx, documento)
}



func (s *ClienteService) ValidarDocumento(documento string) (string, error) {
	documento = apenasDigitos(documento)

	switch len(documento) {
	case 11:
		return s.ValidarCPF(documento)
	case 14:
		return s.ValidarCNPJ(documento)
	default:
		return "", ErrDocumentoInvalido
	}
}

func (s *ClienteService) ValidarCPF(cpf string) (string, error) {
	cpf = apenasDigitos(cpf)

	if len(cpf) != 11 || cpf == strings.Repeat(string(cpf[0]), 11) {
		return "", ErrCPFInvalido
	}

	for _, tamanho := range []int{9, 10} {
		soma := 0
		for i := 0; i < tamanho; i++ {
			soma += int(cpf[i]-'0') * (tamanho + 1 - i)
		}

		resto := (soma * 10) % 11
		if resto == 10 {
			resto = 0
		}

		if resto != int(cpf[tamanho]-'0') {
			return "", ErrCPFInvalido
		}
	}

	return cpf, nil
}

func (s *ClienteService) ValidarCNPJ(cnpj string) (string, error) {
	cnpj = apenasDigitos(cnpj)

	if len(cnpj) != 14 || cnpj == strings.Repeat(string(cnpj[0]), 14) {
		return "", ErrCNPJInvalido
	}

	pesos := [][]int{
		{5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2},
		{6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2},
	}

	for indice, sequencia := range pesos {
		tamanho := 12 + indice

		soma := 0
		for i := 0; i < tamanho; i++ {
			soma += int(cnpj[i]-'0') * sequencia[i]
		}

		resto := soma % 11
		digito := 0
		if resto >= 2 {
			digito = 11 - resto
		}

		if digito != int(cnpj[tamanho]-'0') {
			return "", ErrCNPJInvalido
		}
	}

	return cnpj, nil
}

func (s *ClienteService) ValidarEmail(email string) (string, error) {
	email = strings.ToLower(strings.TrimSpace(email))

	if !emailRegex.MatchString(email) {
		return "", ErrEmailInvalido
	}

	return email, nil
}

func (s *ClienteService) CriarCliente(
	ctx context.Context,
	dados contracts.ClienteCreateRequest,
) (*models.Cliente, error) {
	documento, err := s.ValidarDocumento(dados.Documento)
	if err != nil {
		return nil, err
	}

	existe, err := s.repo.ExistePorDocumento(ctx, documento)
	if err != nil {
		return nil, err
	}
	if existe {
		return nil, ErrDocumentoDuplicado
	}

	email, err := s.ValidarEmail(dados.Email)
	if err != nil {
		return nil, err
	}

	cliente := &models.Cliente{
		Nome:      dados.Nome,
		Documento: documento,
		Email:     email,
		Telefone:  dados.Telefone,
		Ativo:     true,
		CEP:       dados.CEP,
		Endereco:  dados.Endereco,
		Numero:    dados.Numero,
		Cidade:    dados.Cidade,
		Estado:    dados.Estado,
	}

	if err := s.repo.Criar(ctx, cliente); err != nil {
		return nil, err
	}

	return cliente, nil
}

func apenasDigitos(valor string) string {
	return naoDigitosRegex.ReplaceAllString(valor, "")
}

func (s *ClienteService) BuscarPorID(
	ctx context.Context,
	id int64,
) (*models.Cliente, error) {
	return s.repo.BuscarPorID(ctx, id)
}