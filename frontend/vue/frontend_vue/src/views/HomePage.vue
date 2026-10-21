<script setup lang="ts">
import { RouterLink } from 'vue-router'

const indicadores = [
  { titulo: 'Clientes', valor: '—', descricao: 'Cadastros ativos', cor: 'indigo' },
  { titulo: 'Vendas', valor: '—', descricao: 'Total do período', cor: 'emerald' },
  { titulo: 'Pedidos', valor: '—', descricao: 'Pedidos registrados', cor: 'amber' },
  { titulo: 'Financeiro', valor: '—', descricao: 'Visão geral', cor: 'sky' },
]
</script>

<template>
  <section class="space-y-8">
    <div>
      <p class="text-sm font-medium text-indigo-600">Visão geral</p>
      <h2 class="mt-1 text-3xl font-bold tracking-tight text-slate-900">
        Início
      </h2>
      <p class="mt-2 text-slate-500">
        Acompanhe os módulos e acesse as principais operações do sistema.
      </p>
    </div>

    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <article
        v-for="item in indicadores"
        :key="item.titulo"
        class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
      >
        <p class="text-sm font-medium text-slate-500">{{ item.titulo }}</p>
        <p class="mt-4 text-3xl font-bold text-slate-900">{{ item.valor }}</p>
        <p class="mt-2 text-sm text-slate-500">{{ item.descricao }}</p>
      </article>
    </div>

    <div>
      <h3 class="text-lg font-semibold text-slate-900">Acesso rápido</h3>

      <div class="mt-4 grid gap-4 md:grid-cols-2">
        <RouterLink
          to="/clientes"
          class="group rounded-2xl border border-slate-200 bg-white p-6
                 transition hover:border-indigo-300 hover:shadow-md"
        >
          <div class="flex items-center justify-between">
            <h4 class="font-semibold text-slate-900">Clientes</h4>
            <span class="text-indigo-600 transition group-hover:translate-x-1">→</span>
          </div>
          <p class="mt-2 text-sm text-slate-500">
            Consulte, cadastre e gerencie clientes.
          </p>
        </RouterLink>

        <RouterLink
          to="/clientes/novo"
          class="group rounded-2xl border border-slate-200 bg-white p-6
                 transition hover:border-indigo-300 hover:shadow-md"
        >
          <div class="flex items-center justify-between">
            <h4 class="font-semibold text-slate-900">Novo cliente</h4>
            <span class="text-indigo-600 transition group-hover:translate-x-1">→</span>
          </div>
          <p class="mt-2 text-sm text-slate-500">
            Inicie um novo cadastro.
          </p>
        </RouterLink>
      </div>
    </div>
  </section>
</template>