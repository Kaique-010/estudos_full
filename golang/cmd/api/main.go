package main

import (
	"log"
	"net/http"

	_ "vendas-go/docs"
	"vendas-go/internal/database"
	"vendas-go/internal/handlers"
	"vendas-go/internal/middleware"
	"vendas-go/internal/repositories"
	"vendas-go/internal/services"

	httpSwagger "github.com/swaggo/http-swagger"

	"github.com/joho/godotenv"
)

// @title Vendas API - Go
// @version 1.0
// @description API de gerenciamento de clientes do sistema Vendas.
// @BasePath /api

func main() {
	// 0. Carrega as variáveis do arquivo .env
	if err := godotenv.Load(); err != nil {
		log.Println("aviso: arquivo .env não encontrado, usando variáveis do ambiente")
	}

	// 1. Conexão com o banco
	db, err := database.Connect()
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	// 2. Repository: acesso aos dados
	clienteRepository := repositories.NewClienteRepository(db)

	// 3. Service: regras de negócio
	clienteService := services.NewClienteService(clienteRepository)

	// 4. Handler: recebe as requisições HTTP
	clienteHandler := handlers.NewClienteHandler(clienteService)

	// 5. Rotas
	mux := http.NewServeMux()
	base := "/api/"
	// rota para o index
	mux.HandleFunc(base+"index", clienteHandler.Index)
	// rota para criar um cliente com POST
	mux.HandleFunc(base+"clientes_criar", http.HandlerFunc(clienteHandler.Criar))
	// rota para buscar todos os clientes com GET	
	mux.HandleFunc(base+"clientes", http.HandlerFunc(clienteHandler.BuscarTodos))
	// rota para buscar um cliente por ID com GET
	mux.HandleFunc(base+"cliente_id", clienteHandler.BuscarPorID)
	// rota para buscar um cliente por documento com GET
	mux.HandleFunc(base+"cliente_documento", http.HandlerFunc(clienteHandler.BuscarPorDocumento))
	// rota de health check, usada pelo front para identificar o backend ativo
	mux.HandleFunc(base+"health", health)
	mux.Handle(
    "/swagger/",
    httpSwagger.Handler(
        httpSwagger.URL("http://localhost:8080/swagger/doc.json"),
    ),
)

	// 6. Inicializa o servidor
	log.Println("Servidor iniciado em http://localhost:8080/api/")

	if err := http.ListenAndServe(":8080", middleware.CORS(mux)); err != nil {
		log.Fatal(err)
	}
}

func health(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Write([]byte(`{"status":"ok","service":"go"}`))
}
