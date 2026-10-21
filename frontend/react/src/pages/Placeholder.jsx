import { useLocation } from 'react-router-dom'

const title = {
  '/': 'Home',
  '/Clientes': 'Clientes',
}

export default function Placeholder() {
  const location = useLocation()
  return (
    <div>
      <h1>{title[location.pathname]}</h1>
    </div>
  )
}
