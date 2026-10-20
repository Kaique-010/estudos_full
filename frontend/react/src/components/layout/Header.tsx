import { useLocation } from 'react-router-dom'

const pageTitles: Record<string, string> = {
  '/': 'Visão geral',
  '/clientes': 'Clientes',
}

export default function Header() {
  const { pathname } = useLocation()
  const title = pageTitles[pathname] ?? 'ERP'

  return (
    <header className="app-header">
      <div>
        <span className="header-breadcrumb">ERP /{title}</span>
      </div>

      <div className="header-user">
        <div className="user-avatar">LK</div>
        <div className="user-info">
          <strong>Administrador</strong>
          <small>Gestão</small>
        </div>
      </div>
    </header>
  )
}
