import { apiDjango } from '../services/api'
import type { Cliente, ClientePayload } from '@/modules/Clientes/types/cliente'

export const clienteService = {
  async listar(): Promise<Cliente[]> {
    const { data } = await apiDjango.get<Cliente[]>('/clientes')
    console.log(data)
    return data
  },

  async buscarPorId(id: string): Promise<Cliente> {
    const { data } = await apiDjango.get<Cliente>(`/clientes/${id}/`)
    return data
  },

  async criar(payload: ClientePayload): Promise<Cliente> {
    const { data } = await apiDjango.post<Cliente>('/clientes', payload)
    return data
  },

  async atualizar(id: string, payload: ClientePayload): Promise<Cliente> {
    const { data } = await apiDjango.put<Cliente>(`/clientes/${id}/`, payload)
    return data
  },

  async excluir(id: string): Promise<void> {
    await apiDjango.delete(`/clientes/${id}/`)
  },
}
