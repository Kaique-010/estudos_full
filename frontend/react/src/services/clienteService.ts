import { api } from './api'
import type {
  Cliente,
  ClienteCreate,
  ClienteFiltros,
  ClientePaginado,
} from '../types/cliente'

export const clienteService = {
  listar: (filtros: ClienteFiltros = {}) => {
    const params = new URLSearchParams()

    if (filtros.busca) params.set('busca', filtros.busca)
    if (filtros.page != null) params.set('page', String(filtros.page))
    if (filtros.page_size != null)
      params.set('page_size', String(filtros.page_size))
    if (filtros.ordenacao) params.set('ordenacao', filtros.ordenacao)
    if (filtros.data_inicio) params.set('data_inicio', filtros.data_inicio)
    if (filtros.data_fim) params.set('data_fim', filtros.data_fim)

    const query = params.toString()

    return api<ClientePaginado>(`/clientes${query ? `?${query}` : ''}`)
  },
  buscarPorId: (id: number) => api<Cliente>(`/cliente_id?id=${id}`),

  buscarPorDocumento: (documento: string) =>
    api<Cliente>(`/clientes?busca=${encodeURIComponent(documento)}`),

  criar: (cliente: ClienteCreate) =>
    api<Cliente>('/clientes_criar', {
      method: 'POST',
      body: JSON.stringify(cliente),
    }),
}
