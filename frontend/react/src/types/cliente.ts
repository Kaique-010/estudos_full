export interface Cliente {
  id: number
  nome: string
  documento: string
  email: string
  telefone: string
  ativo: boolean
  cep: string
  endereco: string
  numero: string
  cidade: string
  estado: string
  criado_em: string
}

export interface ClienteFiltros {
  busca?: string
  page?: number
  page_size?: number
  ordenacao?: string
  data_inicio?: string
  data_fim?: string
}

export interface ClientePaginado {
  count: number
  page: number
  page_size: number
  total_pages: number
  next: number | null
  previous: number | null
  results: Cliente[]
}

export type ClienteCreate = Omit<Cliente, 'id' | 'ativo' | 'criado_em'>
