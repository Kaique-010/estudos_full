import { Link } from 'react-router-dom'

const modules = [
  {
    title: 'Clientes',
    description: 'Consulte e gerencie os clientes cadastrados.',
    icon: '♙',
    path: '/clientes',
  },
]

export default function HomePage() {
  return (
    <div className="home-page">
      <section className="welcome-panel">
        <div>
          <span className="eyebrow">PAINEL PRINCIPAL</span>
          <h2>Bem-vindo </h2>
          <p>Gerencie as informações da sua empresa em um só lugar.</p>
        </div>

        <div className="welcome-symbol">E</div>
      </section>

      <section className="home-section">
        <div className="section-heading">
          <div>
            <h2>Módulos</h2>
            <p>Acesse as áreas do sistema.</p>
          </div>
        </div>

        <div className="module-grid">
          {modules.map((module) => (
            <Link to={module.path} className="module-card" key={module.path}>
              <div className="module-icon">{module.icon}</div>
              <h3>{module.title}</h3>
              <p>{module.description}</p>
              <span className="module-action">
                Acessar módulo <span>→</span>
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
