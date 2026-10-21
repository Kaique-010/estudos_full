<script setup lang="ts">
import { reactive, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import type { ClientePayload } from '../types/cliente'

const route = useRoute()

const formulario = reactive<ClientePayload>({
  nome: '',
  documento: '',
  email: '',
  telefone: '',
  ativo: true,
})

const editando = () => Boolean(route.params.id)

watch(
  () => route.params.id,
  () => {
    Object.assign(formulario, {
      nome: '',
      documento: '',
      email: '',
      telefone: '',
      ativo: true,
    })

    // Na edição, carregaremos o cliente pela API usando o ID da rota.
  },
  { immediate: true },
)

function salvar() {
  // A persistência será implementada ao conectar o endpoint real.
  // Não simular sucesso antes de enviar os dados ao backend.
}
</script>

<template>
  <section class="mx-auto max-w-3xl space-y-6">
    <div>
      <RouterLink to="/clientes" class="text-sm font-medium text-indigo-600 hover:text-indigo-800">
        ← Voltar para clientes
      </RouterLink>

      <h2 class="mt-4 text-3xl font-bold text-slate-900">
        {{ editando() ? 'Editar cliente' : 'Novo cliente' }}
      </h2>
      <p class="mt-2 text-sm text-slate-500">
        Preencha os dados cadastrais.
      </p>
    </div>

    <form
      class="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      @submit.prevent="salvar"
    >
      <div class="grid gap-5 sm:grid-cols-2">
        <label class="space-y-2 sm:col-span-2">
          <span class="block text-sm font-medium text-slate-700">Nome / Razão social *</span>
          <input
            v-model="formulario.nome"
            required
            maxlength="150"
            class="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            placeholder="Nome do cliente"
          />
        </label>

        <label class="space-y-2">
          <span class="block text-sm font-medium text-slate-700">CPF / CNPJ *</span>
          <input
            v-model="formulario.documento"
            required
            class="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            placeholder="Documento"
          />
        </label>

        <label class="space-y-2">
          <span class="block text-sm font-medium text-slate-700">Telefone</span>
          <input
            v-model="formulario.telefone"
            type="tel"
            class="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            placeholder="(00) 00000-0000"
          />
        </label>

        <label class="space-y-2 sm:col-span-2">
          <span class="block text-sm font-medium text-slate-700">E-mail</span>
          <input
            v-model="formulario.email"
            type="email"
            class="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            placeholder="cliente@empresa.com"
          />
        </label>

        <label class="flex items-center gap-3 sm:col-span-2">
          <input
            v-model="formulario.ativo"
            type="checkbox"
            class="h-4 w-4 rounded border-slate-300 accent-indigo-600"
          />
          <span class="text-sm font-medium text-slate-700">Cliente ativo</span>
        </label>
      </div>

      <div class="flex flex-col-reverse justify-end gap-3 border-t border-slate-100 pt-5 sm:flex-row">
        <RouterLink
          to="/clientes"
          class="rounded-lg border border-slate-300 px-4 py-2.5 text-center text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          Cancelar
        </RouterLink>

        <button
          type="submit"
          class="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          {{ editando() ? 'Salvar alterações' : 'Cadastrar cliente' }}
        </button>
      </div>

      <p class="text-xs text-slate-500">
        A gravação será habilitada após a integração com a API.
      </p>
    </form>
  </section>
</template>