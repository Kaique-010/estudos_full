// Remove barras finais para não gerar URL com barra dupla (/api//clientes).
export const API_URL = (
  import.meta.env.VITE_API_URL ?? 'http://localhost:8080'
).replace(/\/+$/, '')

export async function api<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  if (!response.ok) {
    const mensagem = await response.text()
    throw new Error(mensagem || `Erro HTTP ${response.status}`)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return response.json() as Promise<T>
}

// Consulta /health para descobrir qual backend está respondendo.
// Retorna o nome do serviço ou null se estiver fora do ar.
export async function identificarBackend(): Promise<string | null> {
  try {
    const response = await fetch(`${API_URL}/health`)
    if (!response.ok) {
      return null
    }

    const dados = (await response.json()) as { service?: string }
    return dados.service ?? 'api'
  } catch {
    return null
  }
}
