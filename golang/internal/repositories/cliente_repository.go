package repositories

import (
	"context"
	"database/sql"
	"errors"

	"vendas-go/internal/models"
)

var ErrClienteNaoEncontrado = errors.New("cliente não encontrado")

const clienteColunas = `
	id, nome, documento, email, telefone, ativo,
	cep, endereco, numero, cidade, estado
`

// rowScanner cobre tanto *sql.Row quanto *sql.Rows.
type rowScanner interface {
	Scan(dest ...any) error
}

type ClienteRepository struct {
	db *sql.DB
}

func NewClienteRepository(db *sql.DB) *ClienteRepository {
	return &ClienteRepository{db: db}
}

func (r *ClienteRepository) BuscarPorID(
	ctx context.Context,
	id int64,
) (*models.Cliente, error) {
	query := `SELECT ` + clienteColunas + ` FROM cliente WHERE id = $1`

	return scanCliente(r.db.QueryRowContext(ctx, query, id))
}

func (r *ClienteRepository) BuscarPorDocumento(
	ctx context.Context,
	documento string,
) (*models.Cliente, error) {
	query := `SELECT ` + clienteColunas + ` FROM cliente WHERE documento = $1`

	return scanCliente(r.db.QueryRowContext(ctx, query, documento))
}

func (r *ClienteRepository) BuscarTodos(
	ctx context.Context,
) ([]*models.Cliente, error) {
	query := `SELECT ` + clienteColunas + ` FROM cliente ORDER BY nome`

	rows, err := r.db.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	clientes := make([]*models.Cliente, 0)

	for rows.Next() {
		cliente, err := scanCliente(rows)
		if err != nil {
			return nil, err
		}
		clientes = append(clientes, cliente)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return clientes, nil
}

func (r *ClienteRepository) Criar(
	ctx context.Context,
	cliente *models.Cliente,
) error {
	query := `
		INSERT INTO cliente (
			nome, documento, email, telefone, ativo,
			cep, endereco, numero, cidade, estado,
			criado_em, atualizado_em
		)
		VALUES (
			$1, $2, $3, $4, $5,
			$6, $7, $8, $9, $10,
			NOW(), NOW()
		)
		RETURNING id, criado_em
	`

	return r.db.QueryRowContext(
		ctx,
		query,
		cliente.Nome,
		cliente.Documento,
		cliente.Email,
		cliente.Telefone,
		cliente.Ativo,
		cliente.CEP,
		cliente.Endereco,
		cliente.Numero,
		cliente.Cidade,
		cliente.Estado,
	).Scan(&cliente.ID, &cliente.CriadoEm)
}

func (r *ClienteRepository) ExistePorDocumento(
	ctx context.Context,
	documento string,
) (bool, error) {
	query := `SELECT EXISTS (
		SELECT 1 FROM cliente WHERE documento = $1
	)`

	var existe bool
	err := r.db.QueryRowContext(ctx, query, documento).Scan(&existe)

	return existe, err
}

func scanCliente(row rowScanner) (*models.Cliente, error) {
	cliente := &models.Cliente{}

	err := row.Scan(
		&cliente.ID,
		&cliente.Nome,
		&cliente.Documento,
		&cliente.Email,
		&cliente.Telefone,
		&cliente.Ativo,
		&cliente.CEP,
		&cliente.Endereco,
		&cliente.Numero,
		&cliente.Cidade,
		&cliente.Estado,
	)

	if errors.Is(err, sql.ErrNoRows) {
		return nil, ErrClienteNaoEncontrado
	}
	if err != nil {
		return nil, err
	}

	return cliente, nil
}
