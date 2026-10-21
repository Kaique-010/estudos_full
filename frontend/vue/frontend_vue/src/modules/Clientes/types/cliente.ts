export interface Cliente {
  id: number | string
  nome: string
  documento: string
  email: string
  telefone: string
  ativo: boolean
}

export interface ClientePayload {
  nome: string
  documento: string
  email: string
  telefone: string
  ativo: boolean
}