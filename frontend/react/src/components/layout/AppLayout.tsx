import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'

export default function AppLayout() {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="app-layout-content">
        <Header />
        <main className="app-layout-main">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
