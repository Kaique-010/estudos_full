import { useCallback, useEffect, useState } from 'react'
import { Users } from 'lucide-react'

import { clienteService } from '../../services/clienteService'
import type {
  Cliente,
  ClienteFiltros,
  ClientePaginado,
} from '../../types/cliente'

import './ClientesPage.css'

type RespostaClientes = Cliente[] | Partial<ClientePaginado> | null | undefined

const TAMANHO_PAGINA_PADRAO = 20

function normalizarResposta(
  resposta: RespostaClientes,
  paginaSolicitada: number,
  tamanhoPagina: number,
): ClientePaginado {
  // Algumas APIs retornam diretamente um array.
  if (Array.isArray(resposta)) {
    const total = resposta.length
    const totalPaginas = Math.max(1, Math.ceil(total / tamanhoPagina))

    const inicio = (paginaSolicitada - 1) * tamanhoPagina

    return {
      count: total,
      page: paginaSolicitada,
      page_size: tamanhoPagina,
      total_pages: totalPaginas,
      next: paginaSolicitada < totalPaginas ? paginaSolicitada + 1 : null,
      previous: paginaSolicitada > 1 ? paginaSolicitada - 1 : null,
      results: resposta.slice(inicio, inicio + tamanhoPagina),
    }
  }

  // Outras APIs retornam um objeto paginado.
  const dados = resposta ?? {}
  const resultados = Array.isArray(dados.results) ? dados.results : []

  const total = Number.isFinite(Number(dados.count))
    ? Number(dados.count)
    : resultados.length

  const pagina = Number.isFinite(Number(dados.page))
    ? Math.max(1, Number(dados.page))
    : paginaSolicitada

  const tamanho = Number.isFinite(Number(dados.page_size))
    ? Math.max(1, Number(dados.page_size))
    : tamanhoPagina

  const totalPaginas = Number.isFinite(Number(dados.total_pages))
    ? Math.max(1, Number(dados.total_pages))
    : Math.max(1, Math.ceil(total / tamanho))

  return {
    count: total,
    page: pagina,
    page_size: tamanho,
    total_pages: totalPaginas,
    next: dados.next ?? (pagina < totalPaginas ? pagina + 1 : null),
    previous: dados.previous ?? (pagina > 1 ? pagina - 1 : null),
    results: resultados,
  }
}

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState('')

  const [busca, setBusca] = useState('')
  const [dataInicio, setDataInicio] = useState('')
  const [dataFim, setDataFim] = useState('')
  const [ordenacao, setOrdenacao] = useState('-criado_em')

  const [pagina, setPagina] = useState(1)
  const [totalPaginas, setTotalPaginas] = useState(1)
  const [totalRegistros, setTotalRegistros] = useState(0)
  const [tamanhoPagina, setTamanhoPagina] = useState(TAMANHO_PAGINA_PADRAO)

  const carregarClientes = useCallback(
    async (filtros: ClienteFiltros = {}) => {
      setCarregando(true)
      setErro('')

      const paginaSolicitada = filtros.page ?? pagina
      const tamanhoSolicitado = filtros.page_size ?? tamanhoPagina

      try {
        const resposta = await clienteService.listar({
          busca,
          data_inicio: dataInicio,
          data_fim: dataFim,
          ordenacao,
          page: paginaSolicitada,
          page_size: tamanhoSolicitado,
          ...filtros,
        })

        const dados = normalizarResposta(
          resposta as RespostaClientes,
          paginaSolicitada,
          tamanhoSolicitado,
        )

        setClientes(dados.results)
        setPagina(dados.page)
        setTotalPaginas(dados.total_pages)
        setTotalRegistros(dados.count)
      } catch (error) {
        setClientes([])
        setTotalPaginas(1)
        setTotalRegistros(0)
        setErro(
          error instanceof Error
            ? error.message
            : 'Não foi possível carregar os clientes.',
        )
      } finally {
        setCarregando(false)
      }
    },
    [busca, dataInicio, dataFim, ordenacao, pagina, tamanhoPagina],
  )

  // Carrega somente na montagem inicial.
  useEffect(() => {
    void carregarClientes()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function aplicarFiltros() {
    setPagina(1)
    void carregarClientes({ page: 1 })
  }

  function limparFiltros() {
    setBusca('')
    setDataInicio('')
    setDataFim('')
    setOrdenacao('-criado_em')
    setPagina(1)
    setTamanhoPagina(TAMANHO_PAGINA_PADRAO)

    void carregarClientes({
      busca: '',
      data_inicio: '',
      data_fim: '',
      ordenacao: '-criado_em',
      page: 1,
      page_size: TAMANHO_PAGINA_PADRAO,
    })
  }

  function mudarPagina(novaPagina: number) {
    if (novaPagina < 1 || novaPagina > totalPaginas || novaPagina === pagina) {
      return
    }

    setPagina(novaPagina)
    void carregarClientes({ page: novaPagina })
  }

  function mudarTamanhoPagina(novoTamanho: number) {
    setTamanhoPagina(novoTamanho)
    setPagina(1)

    void carregarClientes({
      page: 1,
      page_size: novoTamanho,
    })
  }

  return (
    <section className="clientes-page">
      <div className="page-heading">
        <div>
          <h2>
            <Users size={24} />
            Clientes
          </h2>
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
        <div className="clientes-filtros">
          <input
            type="text"
            placeholder="Buscar por nome, documento, e-mail ou telefone"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') aplicarFiltros()
            }}
          />

          <label>
            Data inicial
            <input
              type="date"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
            />
          </label>

          <label>
            Data final
            <input
              type="date"
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
              min={dataInicio || undefined}
            />
          </label>

          <select
            value={ordenacao}
            onChange={(e) => setOrdenacao(e.target.value)}>
            <option value="id">ID crescente</option>
            <option value="-id">ID decrescente</option>
            <option value="nome">Nome A–Z</option>
            <option value="-nome">Nome Z–A</option>
            <option value="-criado_em">Mais recentes</option>
            <option value="criado_em">Mais antigos</option>
          </select>

          <button
            className="btn-primary"
            onClick={aplicarFiltros}
            disabled={carregando}>
            Filtrar
          </button>

          <button
            className="btn-secondary"
            onClick={limparFiltros}
            disabled={carregando}>
            Limpar
          </button>
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
            <p>Não há clientes para os filtros selecionados.</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead className="thead">
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
                      <strong>{cliente.nome || '—'}</strong>
                      <small className="secondary-text">
                        {cliente.email || '—'}
                      </small>
                    </td>

                    <td>{cliente.documento || '—'}</td>
                    <td>{cliente.telefone || '—'}</td>
                    <td>
                      {[cliente.cidade, cliente.estado]
                        .filter(Boolean)
                        .join(' / ') || '—'}
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

        <div className="data-card-header">
          <p>
            {clientes.length}{' '}
            {clientes.length === 1
              ? 'registro nesta página'
              : 'registros nesta página'}
            {' · '}
            {totalRegistros} no total
          </p>

          <div className="clientes-paginacao">
            <label>
              Por página
              <select
                value={tamanhoPagina}
                onChange={(e) => mudarTamanhoPagina(Number(e.target.value))}
                disabled={carregando}>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </label>

            <button
              className="btn-secondary"
              onClick={() => mudarPagina(pagina - 1)}
              disabled={carregando || pagina <= 1}>
              Anterior
            </button>

            <span>
              Página {pagina} de {totalPaginas}
            </span>

            <button
              className="btn-secondary"
              onClick={() => mudarPagina(pagina + 1)}
              disabled={carregando || pagina >= totalPaginas}>
              Próxima
            </button>
          </div>
        </div>
      </section>
    </section>
  )
}
