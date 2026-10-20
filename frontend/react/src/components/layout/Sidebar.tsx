import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'

import { API_URL, identificarBackend } from '../../services/api'

export default function Sidebar() {
  const [servico, setServico] = useState<string | null>(null)
  const [verificando, setVerificando] = useState(true)

  useEffect(() => {
    let ativo = true

    void identificarBackend()
      .then((nome) => {
        if (ativo) setServico(nome)
      })
      .finally(() => {
        if (ativo) setVerificando(false)
      })

    return () => {
      ativo = false
    }
  }, [])

  const host = API_URL.replace(/^https?:\/\//, '')

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="brand-mark">E</span>
        <div>
          <strong>ERP</strong>
          <small>Gestão empresarial</small>
        </div>
      </div>

      <nav className="sidebar-nav">
        <span className="nav-section">PRINCIPAL</span>

        <NavLink to="/" end className="nav-link">
          <span>⌂</span>
          <span>Início</span>
        </NavLink>

        <span className="nav-section">CADASTROS</span>

        <NavLink to="/clientes" className="nav-link">
          <span>♙</span>
          <span>Clientes</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <span
          className={`status-dot ${servico ? 'is-online' : 'is-offline'}`}
        />
        {servico ? `API ${servico}` : host}
        <span className="status-label">
          {verificando ? 'Verificando' : servico ? 'Online' : 'Offline'}
        </span>
      </div>
    </aside>
  )
}
