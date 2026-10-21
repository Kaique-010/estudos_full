import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AppLayout from '../components/layout/AppLayout'
import Home from '../pages/Home/HomePage'
import Clientes from '../pages/Clientes/ClientesPage'

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route path="/Clientes" element={<Clientes />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
