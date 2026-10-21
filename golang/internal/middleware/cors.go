package middleware

import (
	"net/http"
	"os"
	"strings"
)

func originsPermitidas() map[string]bool {
	raw := os.Getenv("CORS_ORIGINS")

	if strings.TrimSpace(raw) == "" {
		raw = "http://localhost:5173,http://127.0.0.1:5173,http://localhost:8081,http://127.0.0.1:8081"
	}

	origins := make(map[string]bool)

	for _, origin := range strings.Split(raw, ",") {
		origin = strings.TrimSpace(origin)
		if origin != "" {
			origins[origin] = true
		}
	}

	return origins
}

func CORS(next http.Handler) http.Handler {
	origins := originsPermitidas()

	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		origin := r.Header.Get("Origin")

		if origins[origin] {
			w.Header().Set("Access-Control-Allow-Origin", origin)
			w.Header().Set("Vary", "Origin")
			w.Header().Set(
				"Access-Control-Allow-Methods",
				"GET, POST, PUT, PATCH, DELETE, OPTIONS",
			)
			w.Header().Set(
				"Access-Control-Allow-Headers",
				"Content-Type, Authorization",
			)
			w.Header().Set("Access-Control-Max-Age", "86400")
		}

		if r.Method == http.MethodOptions {
			if !origins[origin] {
				http.Error(w, "Origin não permitida", http.StatusForbidden)
				return
			}

			w.WriteHeader(http.StatusNoContent)
			return
		}

		next.ServeHTTP(w, r)
	})
}
