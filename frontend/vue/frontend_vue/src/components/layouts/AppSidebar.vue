<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

const route = useRoute()
const clientesAberto = ref(true)

const linkBase =
  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors'

function linkClass(path: string) {
  const active = route.path === path

  return [
    linkBase,
    active
      ? 'bg-indigo-50 font-semibold text-indigo-700'
      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
  ]
}
</script>

<template>
  <aside
    class="flex min-h-screen w-full flex-col border-r border-slate-200 bg-white md:w-64 md:shrink-0">
    <div class="flex h-16 items-center gap-3 border-b border-slate-200 px-5">
      <div
        class="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 font-bold text-white">
        E
      </div>

      <div>
        <p class="font-bold tracking-tight text-slate-900">ERP</p>
        <p class="text-xs text-slate-500">Painel de gestão</p>
      </div>
    </div>

    <nav class="flex-1 space-y-2 p-4">
      <p
        class="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
        Principal
      </p>

      <RouterLink to="/" :class="linkClass('/')">
        <span>⌂</span>
        <span>Início</span>
      </RouterLink>

      <div>
        <button
          class="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
          @click="clientesAberto = !clientesAberto">
          <span class="flex items-center gap-3">
            <span>♙</span>
            Clientes
          </span>

          <span>{{ clientesAberto ? '−' : '+' }}</span>
        </button>

        <div
          v-if="clientesAberto"
          class="ml-5 mt-1 space-y-1 border-l border-slate-200 pl-3">
          <RouterLink to="/clientes" :class="linkClass('/clientes')">
            Listagem
          </RouterLink>

          <RouterLink to="/clientes/novo" :class="linkClass('/clientes/novo')">
            Novo cliente
          </RouterLink>
        </div>
      </div>
    </nav>

    <div class="border-t border-slate-200 p-4">
      <p class="text-xs text-slate-500">Frontend Vue 3</p>
      <p class="mt-1 text-sm font-medium text-slate-700">
        Ambiente de desenvolvimento
      </p>
    </div>
  </aside>
</template>
