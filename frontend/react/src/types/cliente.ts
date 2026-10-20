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

export type ClienteCreate = Omit<Cliente, 'id' | 'ativo' | 'criado_em'>
