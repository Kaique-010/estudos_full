package middleware

import (
	"net/http"
	"os"
	"strings"
)

// originsPermitidas lê CORS_ORIGINS (separado por vírgula).
// Sem a variável, libera o front de desenvolvimento.
func originsPermitidas() map[string]bool {
    raw := os.Getenv("CORS_ORIGINS")

    if strings.TrimSpace(raw) == "" {
        raw = "http://localhost:5173,http://localhost:8081,http://localhost:8001"
    }

    origins := make(map[string]bool)

    for _, origin := range strings.Split(raw, ",") {
        if origin = strings.TrimSpace(origin); origin != "" {
            origins[origin] = true
        }
    }

    return origins
}
// CORS libera o acesso do frontend e responde os preflights (OPTIONS).
func CORS(next http.Handler) http.Handler {
	origins := originsPermitidas()

	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if origin := r.Header.Get("Origin"); origins[origin] {
			w.Header().Set("Access-Control-Allow-Origin", origin)
			w.Header().Set("Vary", "Origin")
			w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
			w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
			w.Header().Set("Access-Control-Max-Age", "86400")
		}

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}

		next.ServeHTTP(w, r)
	})
}
