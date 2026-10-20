import { createBrowserRouter } from 'react-router-dom'

import AppLayout from '../components/layout/AppLayout'
import ClientPage from '../pages/Clientes/ClientesPage'
import HomePage from '../pages/Home/HomePage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        path: '/clientes',
        element: <ClientPage />,
      },
      {
        path: '/home',
        element: <HomePage />,
      },
    ],
  },
])
