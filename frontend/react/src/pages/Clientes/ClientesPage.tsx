import { useCallback, useEffect, useState } from 'react'

import { clienteService } from '../../services/clienteService'
import type { Cliente } from '../../types/cliente'

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  const carregarClientes = useCallback(async () => {
    setCarregando(true)
    setErro('')

    try {
      const dados = await clienteService.listar()
      setClientes(dados)
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : 'Não foi possível carregar os clientes.',
      )
    } finally {
      setCarregando(false)
    }
  }, [])

  useEffect(() => {
    void carregarClientes()
  }, [carregarClientes])

  return (
    <div className="clientes-page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">CADASTROS</span>
          <h2>Clientes</h2>
          <p>Consulte os clientes cadastrados no sistema.</p>
        </div>

        <button
          className="btn-primary"
          onClick={() => void carregarClientes()}
          disabled={carregando}>
          {carregando ? 'Carregando...' : '↻ Atualizar'}
        </button>
      </div>

      <section className="data-card">
        <div className="data-card-header">
          <div>
            <h3>Todos os clientes</h3>
            <p>
              {clientes.length}{' '}
              {clientes.length === 1 ? 'registro' : 'registros'}
            </p>
          </div>
        </div>

        {carregando ? (
          <div className="state-message">Carregando clientes...</div>
        ) : erro ? (
          <div className="state-message state-error">
            <p>Não foi possível consultar a API.</p>
            <small>{erro}</small>
            <button
              className="btn-secondary"
              onClick={() => void carregarClientes()}>
              Tentar novamente
            </button>
          </div>
        ) : clientes.length === 0 ? (
          <div className="state-message">
            <div className="empty-icon">♙</div>
            <h3>Nenhum cliente encontrado</h3>
            <p>Quando houver clientes cadastrados, eles aparecerão aqui.</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Cliente</th>
                  <th>Documento</th>
                  <th>Contato</th>
                  <th>Cidade / UF</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {clientes.map((cliente) => (
                  <tr key={cliente.id}>
                    <td className="id-cell">{cliente.id}</td>
                    <td>
                      <strong>{cliente.nome}</strong>
                      <small className="secondary-text">{cliente.email}</small>
                    </td>
                    <td>{cliente.documento}</td>
                    <td>{cliente.telefone}</td>
                    <td>
                      {cliente.cidade} / {cliente.estado}
                    </td>
                    <td>
                      <span
                        className={`status-badge ${
                          cliente.ativo ? 'status-active' : 'status-inactive'
                        }`}>
                        {cliente.ativo ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
