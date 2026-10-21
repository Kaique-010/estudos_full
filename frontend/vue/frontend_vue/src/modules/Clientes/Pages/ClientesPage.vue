<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { clienteService } from '@/services/clienteService'
import type { Cliente } from '@/modules/Clientes/types/cliente'

const busca = ref('')
const clientes = ref<Cliente[]>([])
const carregando = ref(false)
const erro = ref('')

async function carregarClientes() {
  carregando.value = true
  erro.value = ''

  try {
    const resposta = await clienteService.listar()

    // Suporta tanto uma lista direta quanto a paginação do Django REST Framework.
    const dados = resposta as unknown

    if (Array.isArray(dados)) {
      clientes.value = dados as Cliente[]
    } else if (
      dados &&
      typeof dados === 'object' &&
      'results' in dados &&
      Array.isArray(dados.results)
    ) {
      clientes.value = dados.results as Cliente[]
    } else {
      console.error('Formato inesperado da API:', dados)
      clientes.value = []
      erro.value = 'A API retornou um formato de dados inesperado.'
    }

    console.log('Clientes carregados:', clientes.value)
  } catch (error) {
    console.error('Erro ao carregar clientes:', error)
    erro.value =
      'Não foi possível carregar os clientes. Verifique a conexão com a API.'
  } finally {
    carregando.value = false
  }
}

onMounted(() => {
  carregarClientes()
})

const clientesFiltrados = computed(() => {
  const termo = busca.value.trim().toLowerCase()

  if (!termo) {
    return clientes.value
  }

  return clientes.value.filter((cliente) =>
    [cliente.nome, cliente.documento, cliente.email].some((campo) =>
      String(campo ?? '')
        .toLowerCase()
        .includes(termo),
    ),
  )
})
</script>

<template>
  <section class="space-y-6">
    <!-- Cabeçalho -->
    <div
      class="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <p class="text-sm font-medium text-indigo-600">Cadastros</p>

        <h2 class="mt-1 text-3xl font-bold text-slate-900">Clientes</h2>

        <p class="mt-2 text-sm text-slate-500">
          Consulte e gerencie os clientes cadastrados.
        </p>
      </div>

      <RouterLink
        to="/clientes/novo"
        class="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700">
        + Novo cliente
      </RouterLink>
    </div>

    <!-- Tabela -->
    <div class="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <!-- Pesquisa -->
      <div
        class="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row">
        <input
          v-model="busca"
          type="search"
          placeholder="Pesquisar por nome, documento ou e-mail..."
          class="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 sm:max-w-md" />

        <button
          type="button"
          :disabled="carregando"
          class="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          @click="carregarClientes">
          Atualizar
        </button>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead
            class="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th class="px-5 py-4 font-semibold">Cliente</th>
              <th class="px-5 py-4 font-semibold">Documento</th>
              <th class="px-5 py-4 font-semibold">E-mail</th>
              <th class="px-5 py-4 font-semibold">Status</th>
              <th class="px-5 py-4 text-right font-semibold">Ações</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-slate-100">
            <!-- Carregando -->
            <tr v-if="carregando">
              <td colspan="5" class="px-5 py-16 text-center text-slate-500">
                Carregando clientes...
              </td>
            </tr>

            <!-- Erro -->
            <tr v-else-if="erro">
              <td colspan="5" class="px-5 py-16 text-center">
                <p class="font-medium text-red-600">
                  {{ erro }}
                </p>

                <button
                  type="button"
                  class="mt-3 font-semibold text-indigo-600 hover:text-indigo-800"
                  @click="carregarClientes">
                  Tentar novamente
                </button>
              </td>
            </tr>

            <!-- Resultados -->
            <template v-else>
              <tr
                v-for="cliente in clientesFiltrados"
                :key="cliente.id"
                class="transition hover:bg-slate-50">
                <td class="px-5 py-4 font-medium text-slate-900">
                  {{ cliente.nome }}
                </td>

                <td class="px-5 py-4 text-slate-600">
                  {{ cliente.documento || '—' }}
                </td>

                <td class="px-5 py-4 text-slate-600">
                  {{ cliente.email || '—' }}
                </td>

                <td class="px-5 py-4">
                  <span
                    :class="
                      cliente.ativo
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-slate-100 text-slate-600'
                    "
                    class="rounded-full px-2.5 py-1 text-xs font-medium">
                    {{ cliente.ativo ? 'Ativo' : 'Inativo' }}
                  </span>
                </td>

                <td class="whitespace-nowrap px-5 py-4 text-right">
                  <RouterLink
                    :to="{
                      name: 'cliente-detalhe',
                      params: { id: cliente.id },
                    }"
                    class="font-medium text-indigo-600 hover:text-indigo-800">
                    Visualizar
                  </RouterLink>

                  <span class="mx-2 text-slate-300">|</span>

                  <RouterLink
                    :to="{
                      name: 'cliente-editar',
                      params: { id: cliente.id },
                    }"
                    class="font-medium text-indigo-600 hover:text-indigo-800">
                    Editar
                  </RouterLink>
                </td>
              </tr>

              <!-- Lista vazia -->
              <tr v-if="clientesFiltrados.length === 0">
                <td colspan="5" class="px-5 py-16 text-center">
                  <div class="mx-auto max-w-sm">
                    <div class="text-3xl text-slate-300">♙</div>

                    <p class="mt-3 font-semibold text-slate-800">
                      {{
                        busca
                          ? 'Nenhum resultado encontrado'
                          : 'Nenhum cliente cadastrado'
                      }}
                    </p>

                    <p class="mt-2 text-sm text-slate-500">
                      {{
                        busca
                          ? 'Tente pesquisar usando outros termos.'
                          : 'Cadastre um cliente para começar.'
                      }}
                    </p>

                    <RouterLink
                      v-if="!busca"
                      to="/clientes/novo"
                      class="mt-4 inline-block text-sm font-semibold text-indigo-600 hover:text-indigo-800">
                      Iniciar cadastro
                    </RouterLink>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>

      <!-- Rodapé -->
      <div class="border-t border-slate-200 px-5 py-3 text-xs text-slate-500">
        {{ clientesFiltrados.length }}
        cliente(s) na listagem atual
      </div>
    </div>
  </section>
</template>
