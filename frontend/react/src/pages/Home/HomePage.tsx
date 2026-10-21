import { SquareDashedMousePointerIcon } from 'lucide-react'

export default function Home() {
  return (
    <section className="page">
      <header className="page-header">
        <div>
          <h1>
            {' '}
            <SquareDashedMousePointerIcon size={45} />
            Dashboard
          </h1>
          <p>Visão geral do sistema e dos serviços.</p>
        </div>
      </header>

      <div className="welcome-panel">
        <h2>Bem-vindo ao sistema</h2>
        <p>
          Aqui reuniremos os indicadores administrativos e o monitoramento das
          APIs Go, Django e FastAPI.
        </p>
      </div>
    </section>
  )
}
