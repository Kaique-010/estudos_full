package handlers

import (
	"encoding/json"
	"errors"
	"log"
	"net/http"
	"strconv"
	"vendas-go/internal/contracts"
	"vendas-go/internal/services"
)


type ClienteHandler struct {
	service *services.ClienteService
}

func NewClienteHandler(service *services.ClienteService) *ClienteHandler {
	return &ClienteHandler{service: service}
}

// Criar godoc
// @Summary Criar cliente
// @Description Cadastra um novo cliente após validar os dados.
// @Tags Clientes
// @Accept json
// @Produce json
// @Param cliente body contracts.ClienteCreateRequest true "Dados do cliente"
// @Success 201 {object} models.Cliente
// @Failure 400 {string} string "Dados inválidos ou JSON malformado"
// @Failure 409 {string} string "Documento já cadastrado"
// @Router /clientes_criar [post]

func (h *ClienteHandler) Criar(w http.ResponseWriter, r *http.Request) {
	var dados contracts.ClienteCreateRequest

	if err := json.NewDecoder(r.Body).Decode(&dados); err != nil {
		http.Error(w, "JSON inválido", http.StatusBadRequest)
		return
	}

	cliente, err := h.service.CriarCliente(r.Context(), dados)
	if err != nil {
		switch {
		case errors.Is(err, services.ErrDocumentoDuplicado):
			http.Error(w, err.Error(), http.StatusConflict)
		default:
			http.Error(w, err.Error(), http.StatusBadRequest)
		}
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)

	if err := json.NewEncoder(w).Encode(cliente); err != nil {
		// A resposta HTTP já começou; registre o erro em logs
		return
	}
}

// @Summary Listar todos os clientes
// @Description Retorna uma lista de todos os clientes cadastrados.
// @Tags Clientes
// @Produce json
// @Success 200 {array} models.Cliente
// @Failure 500 {string} string "Erro interno do servidor"
// @Router /clientes [get]
func (h *ClienteHandler) Index(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("Hello, World!"))
}

func (h *ClienteHandler) BuscarTodos(w http.ResponseWriter, r *http.Request) {
	clientes, err := h.service.BuscarTodos(r.Context())
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	if err := json.NewEncoder(w).Encode(clientes); err != nil {
		// A resposta HTTP já começou; registre o erro em logs
		return
	}
}


// BuscarPorDocumento godoc
// @Summary Buscar cliente por documento
// @Description Busca um cliente pelo CPF ou CNPJ.
// @Tags Clientes
// @Produce json
// @Param documento query string true "CPF ou CNPJ do cliente"
// @Success 200 {object} models.Cliente
// @Failure 400 {string} string "Documento não fornecido"
// @Failure 404 {string} string "Cliente não encontrado"
// @Router /cliente_documento [get]
func (h *ClienteHandler) BuscarPorDocumento(w http.ResponseWriter, r *http.Request) {
    documento := r.URL.Query().Get("documento")
    if documento == "" {
        http.Error(w, "Documento não fornecido", http.StatusBadRequest)
        return
    }

    cliente, err := h.service.BuscarPorDocumento(r.Context(), documento)
    if err != nil {
        http.Error(w, err.Error(), http.StatusNotFound)
        return
    }

    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(http.StatusOK)

    if err := json.NewEncoder(w).Encode(cliente); err != nil {
        log.Printf("erro ao serializar cliente: %v", err)
    }
}

// @Summary Buscar cliente por ID
// @Description Retorna um cliente com base no ID fornecido.
// @Tags Clientes
// @Accept json
// @Produce json
// @Param id query int64 true "ID do cliente"
// @Success 200 {object} models.Cliente
// @Failure 400 {string} string "ID não fornecido"
// @Failure 404 {string} string "Cliente não encontrado"
// @Router /clientes_buscar_por_id [get]
func (h *ClienteHandler) BuscarPorID(w http.ResponseWriter, r *http.Request) {
    idParam := r.URL.Query().Get("id")

    if idParam == "" {
        http.Error(w, "ID não fornecido", http.StatusBadRequest)
        return
    }

    id, err := strconv.ParseInt(idParam, 10, 64)
    if err != nil {
        http.Error(w, "ID inválido", http.StatusBadRequest)
        return
    }

    cliente, err := h.service.BuscarPorID(r.Context(), id)
    if err != nil {
        http.Error(w, err.Error(), http.StatusNotFound)
        return
    }

    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(http.StatusOK)

    if err := json.NewEncoder(w).Encode(cliente); err != nil {
        log.Printf("erro ao serializar cliente: %v", err)
    }
}