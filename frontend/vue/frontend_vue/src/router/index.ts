import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '../layouts/MainLayout.vue'
import HomePage from '../views/HomePage.vue'
import ClientesPage from '@/modules/Clientes/Pages/ClientesPage.vue'
import ClienteFormPage from '@/modules/Clientes/Pages/ClienteFormPage.vue'
import ClienteDetailPage from '@/modules/Clientes/Pages/ClienteDetailPage.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: MainLayout,
      children: [
        {
          path: '',
          name: 'home',
          component: HomePage,
        },
        {
          path: 'clientes',
          name: 'clientes',
          component: ClientesPage,
        },
        {
          path: 'clientes/novo',
          name: 'cliente-novo',
          component: ClienteFormPage,
        },
        {
          path: 'clientes/:id',
          name: 'cliente-detalhe',
          component: ClienteDetailPage,
          props: true,
        },
        {
          path: 'clientes/:id/editar',
          name: 'cliente-editar',
          component: ClienteFormPage,
          props: true,
        },
      ],
    },
  ],
})

export default router
