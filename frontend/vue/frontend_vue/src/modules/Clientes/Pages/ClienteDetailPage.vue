
<script setup lang="ts">
import { RouterLink } from 'vue-router'

defineProps<{ id: string }>()
</script>

<template>
  <section class="mx-auto max-w-3xl space-y-6">
    <RouterLink to="/clientes" class="text-sm font-medium text-indigo-600 hover:text-indigo-800">
      ← Voltar para clientes
    </RouterLink>

    <div>
      <h2 class="mt-3 text-3xl font-bold text-slate-900">Detalhes do cliente</h2>
      <p class="mt-2 text-sm text-slate-500">Identificador: {{ id }}</p>
    </div>

    <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p class="font-semibold text-slate-900">Dados cadastrais</p>
          <p class="mt-1 text-sm text-slate-500">
            Os dados serão carregados da API usando o identificador da rota.
          </p>
        </div>

        <RouterLink
          :to="{ name: 'cliente-editar', params: { id } }"
          class="rounded-lg bg-indigo-600 px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-indigo-700"
        >
          Editar cliente
        </RouterLink>
      </div>
    </div>
  </section>
</template>