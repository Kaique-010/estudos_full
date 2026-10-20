import { api } from './api'
import type { Cliente, ClienteCreate } from '../types/cliente'

export const clienteService = {
  listar: () => api<Cliente[]>('/clientes'),

  buscarPorId: (id: number) => api<Cliente>(`/cliente_id?id=${id}`),

  buscarPorDocumento: (documento: string) =>
    api<Cliente>(`/cliente_documento?documento=${encodeURIComponent(documento)}`),

  criar: (cliente: ClienteCreate) =>
    api<Cliente>('/clientes_criar', {
      method: 'POST',
      body: JSON.stringify(cliente),
    }),
}
